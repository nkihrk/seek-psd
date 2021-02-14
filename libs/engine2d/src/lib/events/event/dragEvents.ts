import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './CommonEvent.interface';

export class DragEvents implements CommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
  }

  onDrag($event: DragEvent): void {}

  onDragend($event: DragEvent): void {}

  onDragenter($event: DragEvent): void {}

  onDragstart($event: DragEvent): void {}

  onDragleave($event: DragEvent): void {}

  onDragover($event: DragEvent): void {}

  onDrop($event: DragEvent): void {}
}
