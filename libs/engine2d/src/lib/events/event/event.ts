import type { EventNotifier } from '../../notifiers/eventNotifier';

export class Event {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
  }
}
