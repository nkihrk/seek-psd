import type { EventNotifier } from '../notifiers/eventNotifier';
import { CommonEvents } from './commonEvents';
import { addEventListeners } from '@seek-psd/utils';
import { CanvasEntity } from '../entities/entity.interface';

export class UserEvents extends CommonEvents {
  private readonly canvasEntity: CanvasEntity;

  constructor($eventNotifier: EventNotifier, $canvasEntity: CanvasEntity) {
    super('user', $eventNotifier);

    this.canvasEntity = $canvasEntity;
  }

  init(): void {
    this._onUserEvents();
  }

  private _onUserEvents(): void {
    // pointer events
    this._pointerEvents();

    // wheel event
    this._wheelEvents();

    // click events
    this._clickEvents();

    // contextmenu event
    this._contextmenuEvents();

    // drag&drop events
    this._dragEvents();

    // clipboard events
    this._clipboardEvents();
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
    addEventListeners(eventList, this.canvasEntity.element, f);
  }

  private _wheelEvents(): void {
    const eventList = ['wheel'];
    const f = (e) => this.onWheelEvents(e);
    addEventListeners(eventList, this.canvasEntity.element, f);
  }

  private _clickEvents(): void {
    const eventList = ['click', 'dblclick'];
    const f = (e) => this.onMouseEvents(e);
    addEventListeners(eventList, this.canvasEntity.element, f);
  }

  private _contextmenuEvents(): void {
    const eventList = ['contextmenu'];
    const f = (e) => this.onMouseEvents(e);
    addEventListeners(eventList, this.canvasEntity.element, f);
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
    addEventListeners(eventList, this.canvasEntity.element, f);
  }

  private _clipboardEvents(): void {
    const eventList = ['cut', 'copy', 'paste'];
    const f = (e) => this.onClipboardEvents(e);
    addEventListeners(eventList, this.canvasEntity.element, f);
  }
}
