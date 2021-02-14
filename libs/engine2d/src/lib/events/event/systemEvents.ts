import type { EventNotifier } from '../../notifiers/eventNotifier';
import { CommonEvent } from './CommonEvent.interface';

export class SystemEvents implements CommonEvent {
  readonly eventNotifier: EventNotifier;

  constructor($eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
  }

  onFullscreenchange($event: Event): void {}

  onFullscreenerror($event: Event): void {}

  onOnline($event: Event): void {}

  onOffline($event: Event): void {}
}
