import type { EventNotifier } from '../notifiers/eventNotifier';
import type { Entity } from '../entities/entity.interface';
import { Events } from './events';

export class UserEvents extends Events {
  private readonly entity: Entity;

  constructor($eventNotifier: EventNotifier, $entity: Entity) {
    super('user', $eventNotifier);

    this.entity = $entity;
  }

  start(): void {
    // pointer events
    this.pointerEvent(this.entity.element);

    // wheel event
    this.wheelEvent(this.entity.element);

    // click events
    this.clickEvent(this.entity.element);

    // contextmenu event
    this.contextmenuEvent(this.entity.element);

    // drag&drop events
    this.dragEvent(this.entity.element);
  }
}
