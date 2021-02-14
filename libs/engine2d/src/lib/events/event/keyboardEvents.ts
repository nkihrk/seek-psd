import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './CommonEvent.interface';

export class KeyboardEvents implements CommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
  }

  onKeydown($event: KeyboardEvent): void {}

  onKeyup($event: KeyboardEvent): void {}

  onKeypress($event: KeyboardEvent): void {}
}
