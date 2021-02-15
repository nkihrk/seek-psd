import type { EventNotifier } from '../../notifiers/eventNotifier';

export abstract class EgCommonEvent {
  protected abstract readonly eventNotifier: EventNotifier;
}
