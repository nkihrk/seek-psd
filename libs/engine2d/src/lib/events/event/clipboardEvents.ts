import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './CommonEvent.interface';

export class ClipboardEvents implements CommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
  }

  onCut($event: ClipboardEvent): void {}

  onCopy($event: ClipboardEvent): void {}

  onPaste($event: ClipboardEvent): void {}
}
