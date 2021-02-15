import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './commonEvent';

export class OnWheelEvent extends CommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onWheel($event: WheelEvent): void {
    this.eventNotifier.update($event);
  }
}
