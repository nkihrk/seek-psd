import type { EventNotifier } from '../notifiers/eventNotifier';
import { CommonEvents } from './commonEvents';

export class GlobalEvents extends CommonEvents {
  constructor($eventNotifier: EventNotifier) {
    super('global', $eventNotifier);
  }

  start(): void {
    // pointer events
    this.pointerEvent(document);

    // wheel event
    this.wheelEvent(document);

    // click events
    this.clickEvent(document);

    // contextmenu event
    this.contextmenuEvent(document);

    // view events
    this.viewEvent(window);

    // network events
    this.networkEvent(window);

    // drag&drop events
    this.dragEvent(document);

    // clipboard events
    this.clipboardEvent(document);

    // keyboard events
    this.keyboardEvent(document);
  }
}
