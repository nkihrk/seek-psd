import type { EventNotifier } from '../../notifiers/eventNotifier';

export abstract class Event {
  protected abstract readonly eventNotifier: EventNotifier;
}
