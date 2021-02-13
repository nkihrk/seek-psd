import { CommonEvent } from './CommonEvent.interface';

export class SystemEvents implements CommonEvent {
  readonly eventType: string;

  constructor($eventType: string) {
    this.eventType = $eventType;
  }

  onFullscreenchange($event: Event): void {
    console.log(`${this.eventType}_screenchange : `, $event);
  }

  onFullscreenerror($event: Event): void {
    console.log(`${this.eventType}_screenerror: `, $event);
  }

  onOnline($event: Event): void {
    console.log(`${this.eventType}_online : `, $event);
  }

  onOffline($event: Event): void {
    console.log(`${this.eventType}_offline : `, $event);
  }
}
