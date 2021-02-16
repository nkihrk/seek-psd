import type { EventNotifier } from '../../notifiers/eventNotifier';
import { Event as CommonEvent } from './event';

export class OnEvent extends CommonEvent {
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
