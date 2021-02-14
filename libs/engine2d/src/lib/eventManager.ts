import { Canvas } from './entities/canvas';
import { CanvasEntity } from './entities/entity.interface';
import { GlobalEvents } from './events/globalEvents';
import { UserEvents } from './events/userEvents';
import { EventNotifier } from './notifiers/eventNotifier';

export class EventManager {
  private canvasEntity: CanvasEntity;

  constructor($element: HTMLCanvasElement) {
    this.canvasEntity = new Canvas($element);

    this._initEvents();
  }

  private _initEvents(): void {
    const globalEventNotifier = new EventNotifier();
    const globalEvents = new GlobalEvents(globalEventNotifier);

    const userEventNotifier = new EventNotifier();
    const userEvents = new UserEvents(userEventNotifier, this.canvasEntity);

    // start eventListeners
    globalEvents.init();
    userEvents.init();

    // observe events data
    this._observe(globalEventNotifier);
    this._observe(userEventNotifier);
  }

  private _observe($eventNotifier: EventNotifier): void {
    $eventNotifier.observer().subscribe((e) => {
      console.log(e);
    });
  }
}
