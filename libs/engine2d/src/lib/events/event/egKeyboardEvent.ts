import type { EventNotifier } from '../../notifiers/eventNotifier';
import { EgCommonEvent } from './egCommonEvent';

export class EgKeyboardEvent extends EgCommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onKeydown($event: KeyboardEvent): void {}

  onKeyup($event: KeyboardEvent): void {}

  onKeypress($event: KeyboardEvent): void {}
}
