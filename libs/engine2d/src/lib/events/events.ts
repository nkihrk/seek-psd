import type { Notifier } from '../notifiers/notifier';
import type { IEventOptions, IFilterResult } from './event/event';
import type { IEventStore } from '../eventStore';
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
  NOTIFY_TYPE,
} from '../constants';
import { Entity } from '../entities/entity';

type TElement = Window | Document | HTMLElement;

export abstract class Events {
  protected entity: Entity;
  private readonly notifier: Notifier<IFilterResult>;
  private onPointerEvent: OnPointerEvent;
  private onWheelEvent: OnWheelEvent;
  private onMouseEvent: OnMouseEvent;
  private onEvent: OnEvent;
  private onDragEvent: OnDragEvent;
  private onClipboardEvent: OnClipboardEvent;
  private onKeyboardEvent: OnKeyboardEvent;

  constructor($eventOptions: IEventOptions) {
    this.notifier = $eventOptions.notifier;

    // initialize events
    this.onPointerEvent = new OnPointerEvent($eventOptions);
    this.onWheelEvent = new OnWheelEvent($eventOptions);
    this.onMouseEvent = new OnMouseEvent($eventOptions);
    this.onEvent = new OnEvent($eventOptions);
    this.onDragEvent = new OnDragEvent($eventOptions);
    this.onClipboardEvent = new OnClipboardEvent($eventOptions);
    this.onKeyboardEvent = new OnKeyboardEvent($eventOptions);
  }

  init($entity: Entity): void {
    this.entity = $entity;
  }

  abstract start(): void;

  protected pointerEvent($element: TElement): void {
    const f = (e) => this._onPointerEvent(e);
    addEventListeners(POINTER_EVENT, $element, f);
  }

  protected wheelEvent($element: TElement): void {
    const f = (e) => this._onWheelEvent(e);
    addEventListeners(WHEEL_EVENT, $element, f);
  }

  protected clickEvent($element: TElement): void {
    const f = (e) => this._onMouseEvent(e);
    addEventListeners(CLICK_EVENT, $element, f);
  }

  protected contextmenuEvent($element: TElement): void {
    const f = (e) => this._onMouseEvent(e);
    addEventListeners(CONTEXTMENU_EVENT, $element, f);
  }

  protected viewEvent($element: TElement): void {
    const f = (e) => this._onEvent(e);
    addEventListeners(VIEW_EVENT, $element, f);
  }

  protected networkEvent($element: TElement): void {
    const f = (e) => this._onEvent(e);
    addEventListeners(NETWORK_EVENT, $element, f);
  }

  protected dragEvent($element: TElement): void {
    const f = (e) => this._onDragEvent(e);
    addEventListeners(DRAG_EVENT, $element, f);
  }

  protected clipboardEvent($element: TElement): void {
    const f = (e) => this._onClipboardEvent(e);
    addEventListeners(CLIPBOARD_EVENT, $element, f);
  }

  protected keyboardEvent($element: TElement): void {
    const f = (e) => this._onKeyboardEvent(e);
    addEventListeners(KEYBOARD_EVENT, $element, f);
  }

  private _onPointerEvent($event: PointerEvent): void {
    if (
      this.notifier.notifyType === NOTIFY_TYPE.GLOBAL &&
      this._isTargetArea($event)
    ) {
      return;
    }

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
    if (
      this.notifier.notifyType === NOTIFY_TYPE.GLOBAL &&
      this._isTargetArea($event)
    ) {
      return;
    }

    const e = this.onWheelEvent;

    switch ($event.type) {
      case 'wheel':
        e.onWheel($event);
        break;
    }
  }

  private _onMouseEvent($event: MouseEvent): void {
    if (
      this.notifier.notifyType === NOTIFY_TYPE.GLOBAL &&
      this._isTargetArea($event)
    ) {
      return;
    }

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
    if (
      this.notifier.notifyType === NOTIFY_TYPE.GLOBAL &&
      this._isTargetArea($event)
    ) {
      return;
    }

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
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _isTargetArea($event: any): boolean {
    if (!this.entity) return false;

    const target: HTMLElement = this.entity.element;
    const tRect: DOMRect = target.getBoundingClientRect();
    const tOriginX: number = tRect.x;
    const tOriginY: number = tRect.y;
    const tWidth: number = tRect.width;
    const tHeight: number = tRect.height;
    const isAreaX: boolean =
      tOriginX <= $event.clientX && $event.clientX <= tOriginX + tWidth;
    const isAreaY: boolean =
      tOriginY <= $event.clientY && $event.clientY <= tOriginY + tHeight;

    return isAreaX && isAreaY;
  }
}
