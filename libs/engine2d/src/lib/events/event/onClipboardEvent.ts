import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './commonEvent';

export class OnClipboardEvent extends CommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onCut($event: ClipboardEvent): void {}

  onCopy($event: ClipboardEvent): void {}

  onPaste($event: ClipboardEvent): void {}
}
