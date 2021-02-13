import { CommonEvent } from './CommonEvent.interface';

export class PointerEvents implements CommonEvent {
  readonly eventType: string;

  constructor($eventType: string) {
    this.eventType = $eventType;
  }

  onPointerdown($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerdown : `, $event);
  }

  onPointerup($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerup : `, $event);
  }

  onPointermove($event: PointerEvent): void {
    console.log(`${this.eventType}_pointermove : `, $event);
  }

  onPointerover($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerover : `, $event);
  }

  onPointerenter($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerenter : `, $event);
  }

  onPointercancel($event: PointerEvent): void {
    console.log(`${this.eventType}_pointercancel : `, $event);
  }

  onPointerout($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerout : `, $event);
  }

  onPointerleave($event: PointerEvent): void {
    console.log(`${this.eventType}_pointerleave : `, $event);
  }
}
