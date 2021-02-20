import type { Entity } from './entities/entity.interface';
import type { NotifiedEvent } from './notifiers/eventNotifier';
import type { StoreManager } from './storeManager';
import { GlobalEvents } from './events/globalEvents';
import { TargetEvents } from './events/targetEvents';
import { EventNotifier } from './notifiers/eventNotifier';
import { EventProcessor } from './eventProcessor';

export class EventManager {
  private entities: Entity[] = [];
  private storeManager: StoreManager;
  private eventProcessor: EventProcessor;

  constructor($storeManager: StoreManager) {
    this.storeManager = $storeManager;
  }

  addEntity($entity: Entity): void {
    this.entities.push($entity);
  }

  start(): void {
    // initialize eventMixer
    this.eventProcessor = new EventProcessor(this.storeManager);

    // start listening events
    this._startEvents();
  }

  private _startEvents(): void {
    const globalEventNotifier = new EventNotifier();
    const globalEvents = new GlobalEvents(globalEventNotifier);
    // start eventListener
    globalEvents.start();
    // observe events data
    this._observe(globalEventNotifier);

    if (this.entities) {
      for (let i = 0; i < this.entities.length; i++) {
        const targetEventNotifier = new EventNotifier();
        const targetEvents = new TargetEvents(
          targetEventNotifier,
          this.entities[i]
        );
        targetEvents.start();
        this._observe(targetEventNotifier);
      }
    }
  }

  private _observe($eventNotifier: EventNotifier): void {
    $eventNotifier.observer().subscribe((e: NotifiedEvent) => {
      this.eventProcessor.process(e);
    });
  }
}
