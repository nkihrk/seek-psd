import { CommonEvent } from './CommonEvent.interface';

export class KeyboardEvents implements CommonEvent {
  readonly eventType: string;

  constructor($eventType: string) {
    this.eventType = $eventType;
  }

  onKeydown($event: KeyboardEvent): void {
    console.log(`${this.eventType}_keydown : `, $event);
  }

  onKeyup($event: KeyboardEvent): void {
    console.log(`${this.eventType}_keyup : `, $event);
  }

  onKeypress($event: KeyboardEvent): void {
    console.log(`${this.eventType}_keypress : `, $event);
  }
}
