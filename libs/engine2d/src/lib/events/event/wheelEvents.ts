import { CommonEvent } from './CommonEvent.interface';

export class WheelEvents implements CommonEvent {
  readonly eventType: string;

  constructor($eventType: string) {
    this.eventType = $eventType;
  }

  onWheel($event: WheelEvent): void {
    console.log(`${this.eventType}_wheel : `, $event);
  }
}
