import type { EventNotifier } from '../../notifiers/eventNotifier';
import { Event } from './event';

export class OnDragEvent extends Event {
  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onDrag($event: DragEvent): void {}

  onDragend($event: DragEvent): void {}

  onDragenter($event: DragEvent): void {}

  onDragstart($event: DragEvent): void {}

  onDragleave($event: DragEvent): void {}

  onDragover($event: DragEvent): void {}

  onDrop($event: DragEvent): void {}
}
