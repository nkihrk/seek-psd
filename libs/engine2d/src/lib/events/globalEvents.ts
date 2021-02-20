import type { Notifier } from '../notifiers/notifier';
import type { FilterResult } from './event/event';
import { Events } from './events';

export class GlobalEvents extends Events {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
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
