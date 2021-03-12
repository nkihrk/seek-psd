import type { IEventStore } from '../eventStore';
import type { Notifier } from '../notifiers/notifier';
import type { IEventOptions } from './event/event';
import { Events } from './events';

export class TargetEvents extends Events {
  constructor($eventOptions: IEventOptions) {
    super($eventOptions);
  }

  start(): void {
    if (!this.entity) {
      throw new Error('Entity is not properly set.');
    }

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
