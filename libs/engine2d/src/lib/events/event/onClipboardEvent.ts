import type { EventNotifier } from '../../notifiers/eventNotifier';
import { Event } from './event';

export class OnClipboardEvent extends Event {
  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onCut($event: ClipboardEvent): void {}

  onCopy($event: ClipboardEvent): void {}

  onPaste($event: ClipboardEvent): void {}
}
