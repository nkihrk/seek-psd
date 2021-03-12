/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IFilterResult } from './events/event/event';
import type { NotifiedEvent } from './notifiers/notifier';
import type { Entity } from './entities';
import type { IPluginSet } from './Global';
import type { IEventStore } from './eventStore';
import { Plugin } from './Global';
import { NOTIFY_TYPE, EVENT_TYPE } from './constants/index';
import { Notifier } from './notifiers/notifier';
import { GlobalEvents } from './events/globalEvents';
import { TargetEvents } from './events/targetEvents';
import { StoreManager } from './storeManager';
import { PluginManager } from './pluginManager';
import { EventStore } from './eventStore';

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
    const eventStore = new EventStore();
    this._createGlobalEvents(eventStore);
    this._createTargetEvents(eventStore);
  }

  private _createGlobalEvents($eventStore: IEventStore): void {
    // create globalEvents
    const globalNotifier = new Notifier<IFilterResult>();
    globalNotifier.notifyType = NOTIFY_TYPE.GLOBAL;
    const globalEvents = new GlobalEvents({
      notifier: globalNotifier,
      eventStore: $eventStore,
    });
    globalEvents.init(this.storeManager.store.entity);
    globalEvents.start();

    // subscribe a notifier's obeserver
    this._observe(globalNotifier);
  }

  private _createTargetEvents($eventStore: IEventStore): void {
    const entity: Entity = this.storeManager.store.entity;

    // return if no entity exits
    if (!entity) return;

    // create targetEvents
    const targetNotifier = new Notifier<IFilterResult>();
    targetNotifier.notifyType = NOTIFY_TYPE.TARGET;
    const targetEvents = new TargetEvents({
      notifier: targetNotifier,
      eventStore: $eventStore,
    });
    targetEvents.init(entity);
    targetEvents.start();

    // subscribe a notifier's obeserver
    this._observe(targetNotifier);
  }

  private _observe($notifier: Notifier<IFilterResult>): void {
    $notifier.observer().subscribe((e) => {
      this._updateStore(e);
    });
  }

  private async _updateStore($e: NotifiedEvent): Promise<void> {
    const eventType: string = $e.content.eventType;
    const flags: any = $e.content.flags;
    const values: any = $e.content.values;
    const defaultEvent: any = $e.content.defaultEvent;

    // prevent it when on initialization
    // I guess this will only work on the initialization stage, but might be wrong
    if (!flags && !values && !defaultEvent) return;

    const plugins: IPluginSet<any>[] = this.pluginManager.searchByEventType(
      eventType
    );

    // insert any typed plugins to the head of the plugins
    const anyPlugins: IPluginSet<any>[] = this.pluginManager.searchByEventType(
      EVENT_TYPE.ANY
    );
    plugins.unshift(...anyPlugins);

    // update notifyType
    this.storeManager.updateNotifyType($e.type);

    // update default event
    this.storeManager.updateDefaultEvent(defaultEvent);

    this.storeManager.updateFlags(eventType, flags);
    this.storeManager.updateValues(eventType, values);

    if (eventType === EVENT_TYPE.POINTER) {
      this.storeManager.updatePointerOffset(flags, values);
    }

    for (let i = 0; i < plugins.length; i++) {
      const pluginSet: IPluginSet<any> = plugins[i];
      const plugin: Plugin<any> = pluginSet.plugin;
      const pluginName: string = this.pluginManager.searchPluginName(
        eventType,
        i
      );

      await plugin.call(this.storeManager.store, this.storeManager.userStore);

      if (!plugin.isNotifierEnabled) continue;

      this.storeManager.updateNotifier.notifyType = eventType;
      this.storeManager.updateNotifier.update({
        pluginName,
        store: this.storeManager.store,
        userStore: this.storeManager.userStore,
      });
    }
  }
}
