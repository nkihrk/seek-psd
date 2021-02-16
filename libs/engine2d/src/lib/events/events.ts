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
} from '../constants/index';

type Elements = Window | Document | HTMLElement;

export abstract class Events {
  private readonly eventNotifier: EventNotifier;
  private onPointerEvent: OnPointerEvent;
  private onWheelEvent: OnWheelEvent;
  private onMouseEvent: OnMouseEvent;
  private onEvent: OnEvent;
  private onDragEvent: OnDragEvent;
  private onClipboardEvent: OnClipboardEvent;
  private onKeyboardEvent: OnKeyboardEvent;

  constructor($eventType: string, $eventNotifier: EventNotifier) {
    this.eventNotifier = $eventNotifier;
    this.eventNotifier.eventType = $eventType;

    // initialize events
    this.onPointerEvent = new OnPointerEvent($eventNotifier);
    this.onWheelEvent = new OnWheelEvent($eventNotifier);
    this.onMouseEvent = new OnMouseEvent($eventNotifier);
    this.onEvent = new OnEvent($eventNotifier);
    this.onDragEvent = new OnDragEvent($eventNotifier);
    this.onClipboardEvent = new OnClipboardEvent($eventNotifier);
    this.onKeyboardEvent = new OnKeyboardEvent($eventNotifier);
  }

  abstract start(): void;

  protected pointerEvent($element: Elements): void {
    const f = (e) => this._onPointerEvent(e);
    addEventListeners(POINTER_EVENT, $element, f);
  }

  protected wheelEvent($element: Elements): void {
    const f = (e) => this._onWheelEvent(e);
    addEventListeners(WHEEL_EVENT, $element, f);
  }

  protected clickEvent($element: Elements): void {
    const f = (e) => this._onMouseEvent(e);
    addEventListeners(CLICK_EVENT, $element, f);
  }

  protected contextmenuEvent($element: Elements): void {
    const f = (e) => this._onMouseEvent(e);
    addEventListeners(CONTEXTMENU_EVENT, $element, f);
  }

  protected viewEvent($element: Elements): void {
    const f = (e) => this._onEvent(e);
    addEventListeners(VIEW_EVENT, $element, f);
  }

  protected networkEvent($element: Elements): void {
    const f = (e) => this._onEvent(e);
    addEventListeners(NETWORK_EVENT, $element, f);
  }

  protected dragEvent($element: Elements): void {
    const f = (e) => this._onDragEvent(e);
    addEventListeners(DRAG_EVENT, $element, f);
  }

  protected clipboardEvent($element: Elements): void {
    const f = (e) => this._onClipboardEvent(e);
    addEventListeners(CLIPBOARD_EVENT, $element, f);
  }

  protected keyboardEvent($element: Elements): void {
    const f = (e) => this._onKeyboardEvent(e);
    addEventListeners(KEYBOARD_EVENT, $element, f);
  }

  private _onPointerEvent($event: PointerEvent): void {
    const e = this.onPointerEvent;

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
    const e = this.onWheelEvent;

    switch ($event.type) {
      case 'wheel':
        e.onWheel($event);
        break;
    }
  }

  private _onMouseEvent($event: MouseEvent): void {
    const e = this.onMouseEvent;

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

  private _onEvent($event: Event): void {
    const e = this.onEvent;

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
    const e = this.onDragEvent;

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
    const e = this.onClipboardEvent;

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
    const e = this.onKeyboardEvent;

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
