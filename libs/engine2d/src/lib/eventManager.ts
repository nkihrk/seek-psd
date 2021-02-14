import { GlobalEvents } from './events/globalEvents';
import { UserEvents } from './events/userEvents';

export class EventManager {
  private element: HTMLElement;

  constructor($element: HTMLElement) {
    this.element = $element;

    this._initEvents($element);
  }

  private _initEvents($element: HTMLElement): void {
    const globalEvents = new GlobalEvents();
    globalEvents.init();

    const userEvents = new UserEvents();
    userEvents.init();
  }
}
