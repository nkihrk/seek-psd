import type { IEventStore } from '../eventStore';
import type { Notifier } from '../notifiers/notifier';
import type { IEventOptions } from './event/event';
import { Events } from './events';

export class GlobalEvents extends Events {
  constructor($eventOptions: IEventOptions) {
    super($eventOptions);
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
    this.viewEvent(document);

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
