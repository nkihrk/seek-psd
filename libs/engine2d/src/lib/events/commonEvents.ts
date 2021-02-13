import { SystemEvents } from './event/systemEvents';
import { MouseEvents } from './event/mouseEvents';
import { WheelEvents } from './event/wheelEvents';
import { PointerEvents } from './event/pointerEvents';
import { DragEvents } from './event/dragEvents';
import { ClipboardEvents } from './event/clipboardEvents';

import { KeyboardEvents } from './event/keyboardEvents';

export class CommonEvents {
  private _eventType: string;

  constructor($eventType: string) {
    this._eventType = $eventType;
  }

  get eventType(): string {
    return this._eventType;
  }

  protected onPointerEvents($event: PointerEvent): void {
    const e = new PointerEvents(this.eventType);

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

  protected onWheelEvents($event: WheelEvent): void {
    const e = new WheelEvents(this.eventType);

    switch ($event.type) {
      case 'wheel':
        e.onWheel($event);
        break;
    }
  }

  protected onMouseEvents($event: MouseEvent): void {
    const e = new MouseEvents(this.eventType);

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

  protected onDragEvents($event: DragEvent): void {
    const e = new DragEvents(this.eventType);

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

  protected onClipboardEvents($event: ClipboardEvent): void {
    const e = new ClipboardEvents(this.eventType);

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

  protected onKeyboardEvents($event: KeyboardEvent): void {
    const e = new KeyboardEvents(this.eventType);

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
