import type { Notifier } from '../notifiers/notifier';
import type { FilterResult } from './event/event';
import { Events } from './events';

export class TargetEvents extends Events {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  start(): void {
    // pointer events
    this.pointerEvent(this.entity.element);

    // wheel event
    this.wheelEvent(this.entity.element);

    // click events
    this.clickEvent(this.entity.element);

    // contextmenu event
    this.contextmenuEvent(this.entity.element);

    // drag&drop events
    this.dragEvent(this.entity.element);
  }
}
