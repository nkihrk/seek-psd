import { CommonEvent } from './CommonEvent.interface';

export class MouseEvents implements CommonEvent {
  readonly eventType: string;

  constructor($eventType: string) {
    this.eventType = $eventType;
  }

  onClick($event: MouseEvent): void {
    console.log(`${this.eventType}_click : `, $event);
  }

  onDblClick($event: MouseEvent): void {
    console.log(`${this.eventType}_dblclick : `, $event);
  }

  onContextmenu($event: MouseEvent): void {
    console.log(`${this.eventType}_contextmenu : `, $event);
  }
}
