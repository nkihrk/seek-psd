import { CommonEvent } from './CommonEvent.interface';

export class ClipboardEvents implements CommonEvent {
  readonly eventType: string;

  constructor($eventType: string) {
    this.eventType = $eventType;
  }

  onCut($event: ClipboardEvent): void {
    console.log(`${this.eventType}_cut : `, $event);
  }

  onCopy($event: ClipboardEvent): void {
    console.log(`${this.eventType}_copy : `, $event);
  }

  onPaste($event: ClipboardEvent): void {
    console.log(`${this.eventType}_paste : `, $event);
  }
}
