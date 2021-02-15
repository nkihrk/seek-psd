import type { EventNotifier } from '../notifiers/eventNotifier';
import { EgEvent } from './event/egEvent';
import { EgMouseEvent } from './event/egMouseEvent';
import { EgWheelEvent } from './event/egWheelEvent';
import { EgPointerEvent } from './event/egPointerEvent';
import { EgDragEvent } from './event/egDragEvent';
import { EgClipboardEvent } from './event/egClipboardEvent';
import { EgKeyboardEvent } from './event/egKeyboardEvent';

export abstract class CommonEvents {
  private readonly eventNotifier: EventNotifier;

  constructor($eventType: string, $eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
    this.eventNotifier.eventType = $eventType;
  }

  abstract start(): void;

  protected onPointerEvent($event: PointerEvent): void {
    const e = new EgPointerEvent(this.eventNotifier);

    switch ($event.type) {
      case 'pointerdown':
        e.onPointerdown($event);
        break;

      case 'pointerup':
        e.onPointerup($event);
        break;

      case 'pointermove':
        e.onPointermove($event);
        break;

      case 'pointerover':
        e.onPointerover($event);
        break;

      case 'pointerenter':
        e.onPointerenter($event);
        break;
      case 'pointercancel':
        e.onPointercancel($event);
        break;

      case 'pointerout':
        e.onPointerout($event);
        break;

      case 'pointerleave':
        e.onPointerleave($event);
        break;
    }
  }

  protected onWheelEvent($event: WheelEvent): void {
    const e = new EgWheelEvent(this.eventNotifier);

    switch ($event.type) {
      case 'wheel':
        e.onWheel($event);
        break;
    }
  }

  protected onMouseEvent($event: MouseEvent): void {
    const e = new EgMouseEvent(this.eventNotifier);

    switch ($event.type) {
      case 'click':
        e.onClick($event);
        break;

      case 'dblclick':
        e.onDblClick($event);
        break;

      case 'contextmenu':
        e.onContextmenu($event);
        break;
    }
  }

  protected onSystemEvent($event: Event): void {
    const e = new EgEvent(this.eventNotifier);

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

  protected onDragEvent($event: DragEvent): void {
    const e = new EgDragEvent(this.eventNotifier);

    switch ($event.type) {
      case 'drag':
        e.onDrag($event);
        break;

      case 'dragend':
        e.onDragend($event);
        break;

      case 'dragenter':
        e.onDragenter($event);
        break;

      case 'dragstart':
        e.onDragstart($event);
        break;

      case 'dragleave':
        e.onDragleave($event);
        break;

      case 'dragover':
        e.onDragover($event);
        break;

      case 'drop':
        e.onDrop($event);
        break;
    }
  }

  protected onClipboardEvent($event: ClipboardEvent): void {
    const e = new EgClipboardEvent(this.eventNotifier);

    switch ($event.type) {
      case 'cut':
        e.onCut($event);
        break;

      case 'copy':
        e.onCopy($event);
        break;

      case 'paste':
        e.onPaste($event);
        break;
    }
  }

  protected onKeyboardEvent($event: KeyboardEvent): void {
    const e = new EgKeyboardEvent(this.eventNotifier);

    switch ($event.type) {
      case 'keydown':
        e.onKeydown($event);
        break;

      case 'keyup':
        e.onKeyup($event);
        break;

      case 'keypress':
        e.onKeypress($event);
        break;
    }
  }
}
