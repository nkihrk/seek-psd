import type { EventNotifier } from '../../notifiers/eventNotifier';
import { EgCommonEvent } from './egCommonEvent';

export class EgClipboardEvent extends EgCommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onCut($event: ClipboardEvent): void {}

  onCopy($event: ClipboardEvent): void {}

  onPaste($event: ClipboardEvent): void {}
}
