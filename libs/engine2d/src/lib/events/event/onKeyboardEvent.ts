import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './commonEvent';

export class OnKeyboardEvent extends CommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onKeydown($event: KeyboardEvent): void {}

  onKeyup($event: KeyboardEvent): void {}

  onKeypress($event: KeyboardEvent): void {}
}
