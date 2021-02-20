import type { Entity } from './entities/entity.interface';
import type { StoreManager } from './storeManager';
import type { FilterResult } from './events/event/event';
import { NOTIFY_TYPE } from './constants/index';
import { Notifier } from './notifiers/notifier';
import { GlobalEvents } from './events/globalEvents';
import { TargetEvents } from './events/targetEvents';
import { EventProcessor } from './eventProcessor';

export class EventManager {
  private entities: Entity[] = [];
  private storeManager: StoreManager;
  private eventProcessor: EventProcessor;

  constructor($storeManager: StoreManager) {
    this.storeManager = $storeManager;

    // initialize eventProcessor
    const storeNotifier = new Notifier<any>();
    storeNotifier.notifyType = NOTIFY_TYPE.STORE;
    const eventProcessor = new EventProcessor(storeNotifier);
    eventProcessor.init(this.storeManager);
    this.eventProcessor = eventProcessor;
  }

  addEntity($entity: Entity): void {
    this.entities.push($entity);
  }

  start(): void {
    // start listening events
    this._startEvents();
  }

  private _startEvents(): void {
    const globalNotifier = new Notifier<FilterResult>();
    globalNotifier.notifyType = NOTIFY_TYPE.GLOBAL;
    const globalEvents = new GlobalEvents(globalNotifier);
    // start eventListener
    globalEvents.start();
    // observe events data
    this._observe(globalNotifier);

    if (this.entities) {
      for (let i = 0; i < this.entities.length; i++) {
        const targetNotifier = new Notifier<FilterResult>();
        targetNotifier.notifyType = `${NOTIFY_TYPE.TARGET}:${i}`;
        const targetEvents = new TargetEvents(targetNotifier);
        targetEvents.init(this.entities[i]);
        targetEvents.start();
        this._observe(targetNotifier);
      }
    }
  }

  private _observe($notifier: Notifier<FilterResult>): void {
    $notifier.observer().subscribe((e) => {
      this.eventProcessor.process(e);
    });
  }
}
