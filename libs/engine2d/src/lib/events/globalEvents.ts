import { CommonEvents } from './commonEvents';

export class GlobalEvents extends CommonEvents {
  constructor() {
    super('global');
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
    this._addEventListeners(eventList, document, f);
  }

  private _wheelEvents(): void {
    const eventList = ['wheel'];
    const f = (e) => this.onWheelEvents(e);
    this._addEventListeners(eventList, document, f);
  }

  private _clickEvents(): void {
    const eventList = ['click', 'dblclick'];
    const f = (e) => this.onMouseEvents(e);
    this._addEventListeners(eventList, document, f);
  }

  private _contextmenuEvents(): void {
    const eventList = ['contextmenu'];
    const f = (e) => this.onMouseEvents(e);
    this._addEventListeners(eventList, document, f);
  }

  private _viewEvents(): void {
    const eventList = ['fullscreenchange, fullscreenerror'];
    const f = (e) => this.onSystemEvents(e);
    this._addEventListeners(eventList, window, f);
  }

  private _networkEvents(): void {
    const eventList = ['online', 'offline'];
    const f = (e) => this.onSystemEvents(e);
    this._addEventListeners(eventList, window, f);
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
    this._addEventListeners(eventList, document, f);
  }

  private _clipboardEvents(): void {
    const eventList = ['cut', 'copy', 'paste'];
    const f = (e) => this.onClipboardEvents(e);
    this._addEventListeners(eventList, document, f);
  }

  private _keyboardEvents(): void {
    const eventList = ['keydown', 'keyup', 'keypress'];
    const f = (e) => this.onKeyboardEvents(e);
    this._addEventListeners(eventList, document, f);
  }

  private _addEventListeners(
    $eventList: string[],
    $element: Window | Document | HTMLDocument,
    $callback: (e, self?: this) => void
  ): void {
    for (let i = 0; i < $eventList.length; i++) {
      $element.addEventListener(
        $eventList[i],
        (e) => $callback(e, this),
        false
      );
    }
  }
}
