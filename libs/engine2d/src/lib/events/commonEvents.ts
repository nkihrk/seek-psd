import type { EventNotifier } from '../notifiers/eventNotifier';
import { addEventListeners } from '@seek-psd/utils';
import { OnEvent } from './event/onEvent';
import { OnMouseEvent } from './event/onMouseEvent';
import { OnWheelEvent } from './event/onWheelEvent';
import { OnPointerEvent } from './event/onPointerEvent';
import { OnDragEvent } from './event/onDragEvent';
import { OnClipboardEvent } from './event/onClipboardEvent';
import { OnKeyboardEvent } from './event/onKeyboardEvent';
import {
  POINTER_EVENT,
  WHEEL_EVENT,
  CLICK_EVENT,
  CONTEXTMENU_EVENT,
  VIEW_EVENT,
  NETWORK_EVENT,
  DRAG_EVENT,
  CLIPBOARD_EVENT,
  KEYBOARD_EVENT,
} from '../constants/constants';

export abstract class CommonEvents {
  private readonly eventNotifier: EventNotifier;

  constructor($eventType: string, $eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
    this.eventNotifier.eventType = $eventType;
  }

  abstract start(): void;

  protected pointerEvent(
    $element: Window | Document | HTMLCanvasElement
  ): void {
    const f = (e) => this._onPointerEvent(e);
    addEventListeners(POINTER_EVENT, $element, f);
  }

  protected wheelEvent($element: Window | Document | HTMLCanvasElement): void {
    const f = (e) => this._onWheelEvent(e);
    addEventListeners(WHEEL_EVENT, $element, f);
  }

  protected clickEvent($element: Window | Document | HTMLCanvasElement): void {
    const f = (e) => this._onMouseEvent(e);
    addEventListeners(CLICK_EVENT, $element, f);
  }

  protected contextmenuEvent(
    $element: Window | Document | HTMLCanvasElement
  ): void {
    const f = (e) => this._onMouseEvent(e);
    addEventListeners(CONTEXTMENU_EVENT, $element, f);
  }

  protected viewEvent($element: Window | Document | HTMLCanvasElement): void {
    const f = (e) => this._onSystemEvent(e);
    addEventListeners(VIEW_EVENT, $element, f);
  }

  protected networkEvent(
    $element: Window | Document | HTMLCanvasElement
  ): void {
    const f = (e) => this._onSystemEvent(e);
    addEventListeners(NETWORK_EVENT, $element, f);
  }

  protected dragEvent($element: Window | Document | HTMLCanvasElement): void {
    const f = (e) => this._onDragEvent(e);
    addEventListeners(DRAG_EVENT, $element, f);
  }

  protected clipboardEvent(
    $element: Window | Document | HTMLCanvasElement
  ): void {
    const f = (e) => this._onClipboardEvent(e);
    addEventListeners(CLIPBOARD_EVENT, $element, f);
  }

  protected keyboardEvent(
    $element: Window | Document | HTMLCanvasElement
  ): void {
    const f = (e) => this._onKeyboardEvent(e);
    addEventListeners(KEYBOARD_EVENT, $element, f);
  }

  private _onPointerEvent($event: PointerEvent): void {
    const e = new OnPointerEvent(this.eventNotifier);

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

  private _onWheelEvent($event: WheelEvent): void {
    const e = new OnWheelEvent(this.eventNotifier);

    switch ($event.type) {
      case 'wheel':
        e.onWheel($event);
        break;
    }
  }

  private _onMouseEvent($event: MouseEvent): void {
    const e = new OnMouseEvent(this.eventNotifier);

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

  private _onSystemEvent($event: Event): void {
    const e = new OnEvent(this.eventNotifier);

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

  private _onDragEvent($event: DragEvent): void {
    const e = new OnDragEvent(this.eventNotifier);

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

  private _onClipboardEvent($event: ClipboardEvent): void {
    const e = new OnClipboardEvent(this.eventNotifier);

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

  private _onKeyboardEvent($event: KeyboardEvent): void {
    const e = new OnKeyboardEvent(this.eventNotifier);

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
