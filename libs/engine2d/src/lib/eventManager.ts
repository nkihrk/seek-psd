import type { Entity } from './entities/entity.interface';
import type { NotifiedEvent } from './notifiers/eventNotifier';
import { GlobalEvents } from './events/globalEvents';
import { UserEvents } from './events/userEvents';
import { EventNotifier } from './notifiers/eventNotifier';

export class EventManager {
  private entities: Entity[] = [];

  constructor() {}

  addEntity($entity: Entity): void {
    this.entities.push($entity);
  }

  start(): void {
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
        const userEventNotifier = new EventNotifier();
        const userEvents = new UserEvents(userEventNotifier, this.entities[i]);
        userEvents.start();
        this._observe(userEventNotifier);
      }
    }
  }

  private _observe($eventNotifier: EventNotifier): void {
    $eventNotifier.observer().subscribe((e: NotifiedEvent) => {
      console.log(e);
    });
  }
}
