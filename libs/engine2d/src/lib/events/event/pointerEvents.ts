import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './CommonEvent.interface';

export class PointerEvents implements CommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
  }

  onPointerdown($event: PointerEvent): void {
    this.eventNotifier.update($event);
  }

  onPointerup($event: PointerEvent): void {}

  onPointermove($event: PointerEvent): void {}

  onPointerover($event: PointerEvent): void {}

  onPointerenter($event: PointerEvent): void {}

  onPointercancel($event: PointerEvent): void {}

  onPointerout($event: PointerEvent): void {}

  onPointerleave($event: PointerEvent): void {}
}
