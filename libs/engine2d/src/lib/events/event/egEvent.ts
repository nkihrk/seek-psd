import type { EventNotifier } from '../../notifiers/eventNotifier';
import { EgCommonEvent } from './egCommonEvent';

export class EgEvent extends EgCommonEvent {
  protected readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    super();
    this.eventNotifier = $eventNotifier;
  }

  onFullscreenchange($event: Event): void {}

  onFullscreenerror($event: Event): void {}

  onOnline($event: Event): void {}

  onOffline($event: Event): void {}
}
