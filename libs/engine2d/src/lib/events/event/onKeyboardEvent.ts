import type { EventNotifier } from '../../notifiers/eventNotifier';
import { Event } from './event';

export class OnKeyboardEvent extends Event {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onKeydown($event: KeyboardEvent): void {}

  onKeyup($event: KeyboardEvent): void {}

  onKeypress($event: KeyboardEvent): void {}
}
