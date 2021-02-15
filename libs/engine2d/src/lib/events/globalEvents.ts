import type { EventNotifier } from '../notifiers/eventNotifier';
import { CommonEvents } from './commonEvents';
import { addEventListeners } from '@seek-psd/utils';
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

export class GlobalEvents extends CommonEvents {
  constructor($eventNotifier: EventNotifier) {
    super('global', $eventNotifier);
  }

  start(): void {
    this._onGlobalEvents();
  }

  private _onGlobalEvents(): void {
    // pointer events
    this._pointerEvent();

    // wheel event
    this._wheelEvent();

    // click events
    this._clickEvent();

    // contextmenu event
    this._contextmenuEvent();

    // view events
    this._viewEvent();

    // network events
    this._networkEvent();

    // drag&drop events
    this._dragEvent();

    // clipboard events
    this._clipboardEvent();

    // keyboard events
    this._keyboardEvent();
  }

  private _pointerEvent(): void {
    const f = (e) => this.onPointerEvent(e);
    addEventListeners(POINTER_EVENT, document, f);
  }

  private _wheelEvent(): void {
    const f = (e) => this.onWheelEvent(e);
    addEventListeners(WHEEL_EVENT, document, f);
  }

  private _clickEvent(): void {
    const f = (e) => this.onMouseEvent(e);
    addEventListeners(CLICK_EVENT, document, f);
  }

  private _contextmenuEvent(): void {
    const f = (e) => this.onMouseEvent(e);
    addEventListeners(CONTEXTMENU_EVENT, document, f);
  }

  private _viewEvent(): void {
    const f = (e) => this.onSystemEvent(e);
    addEventListeners(VIEW_EVENT, window, f);
  }

  private _networkEvent(): void {
    const f = (e) => this.onSystemEvent(e);
    addEventListeners(NETWORK_EVENT, window, f);
  }

  private _dragEvent(): void {
    const f = (e) => this.onDragEvent(e);
    addEventListeners(DRAG_EVENT, document, f);
  }

  private _clipboardEvent(): void {
    const f = (e) => this.onClipboardEvent(e);
    addEventListeners(CLIPBOARD_EVENT, document, f);
  }

  private _keyboardEvent(): void {
    const f = (e) => this.onKeyboardEvent(e);
    addEventListeners(KEYBOARD_EVENT, document, f);
  }
}
