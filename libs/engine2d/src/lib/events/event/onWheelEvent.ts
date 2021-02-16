import type { EventNotifier } from '../../notifiers/eventNotifier';
import { Event } from './event';

export class OnWheelEvent extends Event {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onWheel($event: WheelEvent): void {}
}
