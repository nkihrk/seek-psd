import type { EventNotifier } from '../../notifiers/eventNotifier';

export interface CommonEvent {
  readonly eventNotifier: EventNotifier;
}
