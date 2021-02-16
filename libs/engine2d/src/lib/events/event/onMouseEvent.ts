import type { EventNotifier } from '../../notifiers/eventNotifier';
import { Event } from './event';

export class OnMouseEvent extends Event {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onClick($event: MouseEvent): void {}

  onDblClick($event: MouseEvent): void {}

  onContextmenu($event: MouseEvent): void {}
}
