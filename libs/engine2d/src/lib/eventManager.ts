import type { FilterResult } from './events/event/event';
import type { NotifiedEvent } from './notifiers/notifier';
import type { Entity } from './entities';
import { NOTIFY_TYPE, EVENT_TYPE } from './constants/index';
import { Notifier } from './notifiers/notifier';
import { GlobalEvents } from './events/globalEvents';
import { TargetEvents } from './events/targetEvents';
import { StoreManager } from './storeManager';
import { PluginManager } from './pluginManager';

export class EventManager {
  private storeManager: StoreManager = null;
  private pluginManager: PluginManager = null;

  constructor() {}

  init($storeManager: StoreManager, $pluginManager: PluginManager): void {
    this.storeManager = $storeManager;
    this.pluginManager = $pluginManager;
  }

  start(): void {
    if (!this.storeManager) {
      throw new Error('EventManager is not properly initialized.');
    }

    // start listening events
    this._startEvents();
  }

  private _startEvents(): void {
    this._createGlobalEvents();
    this._createTargetEvents();
  }

  private _createGlobalEvents(): void {
    // create globalEvents
    const globalNotifier = new Notifier<FilterResult>();
    globalNotifier.notifyType = NOTIFY_TYPE.GLOBAL;
    const globalEvents = new GlobalEvents(globalNotifier);
    globalEvents.init(this.storeManager.entity);
    globalEvents.start();

    // subscribe a notifier's obeserver
    this._observe(globalNotifier);
  }

  private _createTargetEvents(): void {
    const entity: Entity = this.storeManager.entity;

    // return if no entity is present
    if (!entity) return;

    // create targetEvents
    const targetNotifier = new Notifier<FilterResult>();
    targetNotifier.notifyType = NOTIFY_TYPE.TARGET;
    const targetEvents = new TargetEvents(targetNotifier);
    targetEvents.init(entity);
    targetEvents.start();

    // subscribe a notifier's obeserver
    this._observe(targetNotifier);
  }

  private _observe($notifier: Notifier<FilterResult>): void {
    $notifier.observer().subscribe((e) => {
      this._updateStore(e);
    });
  }

  private _updateStore($e: NotifiedEvent) {
    const eventType: string = $e.content.eventType;
    const flags: any = $e.content.flags; // eslint-disable-line @typescript-eslint/no-explicit-any
    const values: any = $e.content.values; // eslint-disable-line @typescript-eslint/no-explicit-any
    const defaultEvent: any = $e.content.defaultEvent; // eslint-disable-line @typescript-eslint/no-explicit-any

    // prevent it when on initialization
    // I guess this will only work on the initialization stage, but might be wrong
    if (!flags && !values && !defaultEvent) return;

    // update notifyType
    this.storeManager.updateNotifyType($e.type);
    console.log(this.storeManager.notifyType);

    // update default event
    this.storeManager.updateDefaultEvent(defaultEvent);

    this.storeManager.updateFlags(eventType, flags);
    this.storeManager.updateValues(eventType, values);

    if (eventType === EVENT_TYPE.POINTER) {
      this.storeManager.updatePointerOffset(flags, values);
    }

    this.pluginManager.searchByEventType(eventType).forEach((f) => {
      f.plugin.call(this.storeManager.store, this.storeManager.userStore);
    });
  }
}
