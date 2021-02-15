import type { EventNotifier } from '../../notifiers/eventNotifier';

export abstract class CommonEvent {
  protected abstract readonly eventNotifier: EventNotifier;
}
