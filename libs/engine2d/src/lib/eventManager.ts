import type { CanvasEntity } from './entities/entity.interface';
import type { NotifiedEvent } from './notifiers/eventNotifier';
import { GlobalEvents } from './events/globalEvents';
import { UserEvents } from './events/userEvents';
import { EventNotifier } from './notifiers/eventNotifier';

export class EventManager {
  private canvasEntity: CanvasEntity;

  constructor($canvasEntity: CanvasEntity) {
    this.canvasEntity = $canvasEntity;
  }

  start(): void {
    this._startEvents();
  }

  private _startEvents(): void {
    const globalEventNotifier = new EventNotifier();
    const globalEvents = new GlobalEvents(globalEventNotifier);

    const userEventNotifier = new EventNotifier();
    const userEvents = new UserEvents(userEventNotifier, this.canvasEntity);

    // start eventListeners
    globalEvents.start();
    userEvents.start();

    // observe events data
    this._observe(globalEventNotifier);
    this._observe(userEventNotifier);
  }

  private _observe($eventNotifier: EventNotifier): void {
    $eventNotifier.observer().subscribe((e: NotifiedEvent) => {
      console.log(e);
    });
  }
}
