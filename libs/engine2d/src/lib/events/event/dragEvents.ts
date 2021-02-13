import { CommonEvent } from './CommonEvent.interface';

export class DragEvents implements CommonEvent {
  readonly eventType: string;

  constructor($eventType: string) {
    this.eventType = $eventType;
  }

  onDrag($event: DragEvent): void {
    console.log(`${this.eventType}_drag : `, $event);
  }

  onDragend($event: DragEvent): void {
    console.log(`${this.eventType}_dragend : `, $event);
  }

  onDragenter($event: DragEvent): void {
    console.log(`${this.eventType}_dragenter : `, $event);
  }

  onDragstart($event: DragEvent): void {
    console.log(`${this.eventType}_dragstart : `, $event);
  }

  onDragleave($event: DragEvent): void {
    console.log(`${this.eventType}_dragleave : `, $event);
  }

  onDragover($event: DragEvent): void {
    console.log(`${this.eventType}_dragover : `, $event);
  }

  onDrop($event: DragEvent): void {
    console.log(`${this.eventType}_drop : `, $event);
  }
}
