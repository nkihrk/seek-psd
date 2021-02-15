import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './commonEvent';

export class OnMouseEvent extends CommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onClick($event: MouseEvent): void {}

  onDblClick($event: MouseEvent): void {}

  onContextmenu($event: MouseEvent): void {}
}
