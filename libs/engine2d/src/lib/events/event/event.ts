import type { Notifier } from '../../notifiers/notifier';

export interface FilterResult {
  flags: any;
  values: any;
  eventType: string;
  default: any;
}

export class Event {
  protected readonly notifier: Notifier<FilterResult>;

  constructor($notifier: Notifier<FilterResult>) {
    this.notifier = $notifier;
  }
}
