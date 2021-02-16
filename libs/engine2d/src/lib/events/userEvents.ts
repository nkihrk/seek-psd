import type { EventNotifier } from '../notifiers/eventNotifier';
import { Events } from './events';
import { CanvasEntity } from '../entities/entity.interface';

export class UserEvents extends Events {
  private readonly canvasEntity: CanvasEntity;

  constructor($eventNotifier: EventNotifier, $canvasEntity: CanvasEntity) {
    super('user', $eventNotifier);

    this.canvasEntity = $canvasEntity;
  }

  start(): void {
    // pointer events
    this.pointerEvent(this.canvasEntity.element);

    // wheel event
    this.wheelEvent(this.canvasEntity.element);

    // click events
    this.clickEvent(this.canvasEntity.element);

    // contextmenu event
    this.contextmenuEvent(this.canvasEntity.element);

    // drag&drop events
    this.dragEvent(this.canvasEntity.element);
  }
}
