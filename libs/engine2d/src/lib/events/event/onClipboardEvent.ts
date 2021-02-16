import type { EventNotifier } from '../../notifiers/eventNotifier';
import { Event } from './event';

export class OnClipboardEvent extends Event {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onCut($event: ClipboardEvent): void {}

  onCopy($event: ClipboardEvent): void {}

  onPaste($event: ClipboardEvent): void {}
}
