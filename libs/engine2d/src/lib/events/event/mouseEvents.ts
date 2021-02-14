import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './CommonEvent.interface';

export class MouseEvents implements CommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
  }

  onClick($event: MouseEvent): void {}

  onDblClick($event: MouseEvent): void {}

  onContextmenu($event: MouseEvent): void {}
}
