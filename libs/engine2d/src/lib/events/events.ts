import { SystemEvents } from './event/systemEvents';

export class CommonEvents {
  private _eventType: string;

  constructor($eventType: string) {
    this._eventType = $eventType;
  }

  get eventType(): string {
    return this._eventType;
  }

  protected onPointerdown($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerdown : `, $event);
  }

  protected onPointerup($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerup : `, $event);
  }

  protected onPointermove($event: PointerEvent): void {
    console.log(`${this.eventType}_pointermove : `, $event);
  }

  protected onPointerover($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerover : `, $event);
  }

  protected onPointerenter($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerenter : `, $event);
  }

  protected onPointercancel($event: PointerEvent): void {
    console.log(`${this.eventType}_pointercancel : `, $event);
  }

  protected onPointerout($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerout : `, $event);
  }

  protected onPointerleave($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerleave : `, $event);
  }

  protected onWheel($event: WheelEvent): void {
    console.log(`${this.eventType}_wheel : `, $event);
  }

  protected onClick($event: MouseEvent): void {
    console.log(`${this.eventType}_click : `, $event);
  }

  protected onDblClick($event: MouseEvent): void {
    console.log(`${this.eventType}_dblclick : `, $event);
  }

  protected onContextmenu($event: MouseEvent): void {
    console.log(`${this.eventType}_contextmenu : `, $event);
  }

  protected onSystemEvents($event: Event): void {
    const e = new SystemEvents(this.eventType);

    switch ($event.type) {
      case 'fullscreenchange':
        e.onFullscreenchange($event);
        break;

      case 'fullscreenerror':
        e.onFullscreenerror($event);
        break;

      case 'online':
        e.onOnline($event);
        break;

      case 'offline':
        e.onOffline($event);
        break;
    }
  }
}
