import type { EventNotifier } from '../../notifiers/eventNotifier';
import { PointerValidator } from '../validators/pointerValidator';
import { CommonEvent } from './commonEvent';

export class OnPointerEvent extends CommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onPointerdown($event: PointerEvent): void {
    const e = new PointerValidator($event);
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
