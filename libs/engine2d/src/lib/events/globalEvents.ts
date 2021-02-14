import { CommonEvents } from './commonEvents';
import { addEventListeners } from '@seek-psd/utils';
import type { EventNotifier } from '../notifiers/eventNotifier';

export class GlobalEvents extends CommonEvents {
  constructor($eventNotifier: EventNotifier) {
    super('global', $eventNotifier);
  }

  init(): void {
    this._onGlobalEvents();
  }

  private _onGlobalEvents(): void {
    // pointer events
    this._pointerEvents();

    // wheel event
    this._wheelEvents();

    // click events
    this._clickEvents();

    // contextmenu event
    this._contextmenuEvents();

    // view events
    this._viewEvents();

    // network events
    this._networkEvents();

    // drag&drop events
    this._dragEvents();

    // clipboard events
    this._clipboardEvents();

    // keyboard events
    this._keyboardEvents();
  }

  private _pointerEvents(): void {
    const eventList = [
      'pointerdown',
      'pointerup',
      'pointermove',
      'pointerover',
      'pointerenter',
      'pointercancel',
      'pointerout',
      'pointerleave',
    ];
    const f = (e) => this.onPointerEvents(e);
    addEventListeners(eventList, document, f);
  }

  private _wheelEvents(): void {
    const eventList = ['wheel'];
    const f = (e) => this.onWheelEvents(e);
    addEventListeners(eventList, document, f);
  }

  private _clickEvents(): void {
    const eventList = ['click', 'dblclick'];
    const f = (e) => this.onMouseEvents(e);
    addEventListeners(eventList, document, f);
  }

  private _contextmenuEvents(): void {
    const eventList = ['contextmenu'];
    const f = (e) => this.onMouseEvents(e);
    addEventListeners(eventList, document, f);
  }

  private _viewEvents(): void {
    const eventList = ['fullscreenchange, fullscreenerror'];
    const f = (e) => this.onSystemEvents(e);
    addEventListeners(eventList, window, f);
  }

  private _networkEvents(): void {
    const eventList = ['online', 'offline'];
    const f = (e) => this.onSystemEvents(e);
    addEventListeners(eventList, window, f);
  }

  private _dragEvents(): void {
    const eventList = [
      'drag',
      'dragend',
      'dragenter',
      'dragstart',
      'dragleave',
      'dragover',
      'drop',
    ];
    const f = (e) => this.onDragEvents(e);
    addEventListeners(eventList, document, f);
  }

  private _clipboardEvents(): void {
    const eventList = ['cut', 'copy', 'paste'];
    const f = (e) => this.onClipboardEvents(e);
    addEventListeners(eventList, document, f);
  }

  private _keyboardEvents(): void {
    const eventList = ['keydown', 'keyup', 'keypress'];
    const f = (e) => this.onKeyboardEvents(e);
    addEventListeners(eventList, document, f);
  }
}
