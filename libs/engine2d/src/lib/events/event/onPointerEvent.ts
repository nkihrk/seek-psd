import type { EventNotifier } from '../../notifiers/eventNotifier';
import { PointerMetaFilter } from '../meta-filters/pointerMetaFilter';
import { Event } from './event';

export class OnPointerEvent extends Event {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onPointerdown($event: PointerEvent): void {
    const meta = new PointerMetaFilter($event);
    this.eventNotifier.update(meta);
  }

  onPointerup($event: PointerEvent): void {}

  onPointermove($event: PointerEvent): void {}

  onPointerover($event: PointerEvent): void {}

  onPointerenter($event: PointerEvent): void {}

  onPointercancel($event: PointerEvent): void {}

  onPointerout($event: PointerEvent): void {}

  onPointerleave($event: PointerEvent): void {}
}
