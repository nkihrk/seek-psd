import type { EventNotifier } from '../../notifiers/eventNotifier';
import { EgCommonEvent } from './egCommonEvent';

export class EgWheelEvent extends EgCommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onWheel($event: WheelEvent): void {
    this.eventNotifier.update($event);
  }
}
