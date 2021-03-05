import type { Notifier } from '../../notifiers/notifier';

export interface FilterResult {
  flags: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  values: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  eventType: string;
  defaultEvent: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export class Event {
  protected readonly notifier: Notifier<FilterResult>;

  constructor($notifier: Notifier<FilterResult>) {
    this.notifier = $notifier;
  }
}
