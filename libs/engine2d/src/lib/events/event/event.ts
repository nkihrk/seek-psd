import type { IEventStore } from '../../eventStore';
import type { Notifier } from '../../notifiers/notifier';

export interface IFilterResult {
  flags: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  values: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  eventType: string;
  defaultEvent: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface IEventOptions {
  notifier: Notifier<IFilterResult>;
  eventStore: IEventStore;
}

export class Event {
  protected readonly notifier: Notifier<IFilterResult>;
  protected eventStore: IEventStore;

  constructor($eventOptions: IEventOptions) {
    this.notifier = $eventOptions.notifier;
    this.eventStore = $eventOptions.eventStore;
  }
}
