import type { EventNotifier } from '../../notifiers/eventNotifier';
import { EgCommonEvent } from './egCommonEvent';

export class EgDragEvent extends EgCommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
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
