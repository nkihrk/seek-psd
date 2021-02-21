import type { Entity } from './entities/entity.interface';
import type { FilterResult } from './events/event/event';
import type {
  PointerFlags,
  PointerValues,
} from './events/meta-filters/pointerMetaFilter';
import type {
  ClipboardFlags,
  ClipboardValues,
} from './events/meta-filters/clipboardMetaFilter';
import type {
  KeyboardFlags,
  KeyboardValues,
} from './events/meta-filters/keyboardMetaFilter';
import type {
  DragFlags,
  DragValues,
} from './events/meta-filters/dragMetaFilter';
import type {
  EventFlags,
  EventValues,
} from './events/meta-filters/eventMetaFilter';
import type {
  MouseFlags,
  MouseValues,
} from './events/meta-filters/mouseMetaFilter';
import type {
  WheelFlags,
  WheelValues,
} from './events/meta-filters/wheelMetaFilter';
import { NOTIFY_TYPE, EVENT_TYPE } from './constants/index';
import { Notifier } from './notifiers/notifier';
import { GlobalEvents } from './events/globalEvents';
import { TargetEvents } from './events/targetEvents';
import { StoreManager } from './storeManager';
import { Canvas } from './entities/canvas';

export class Engine2D {
  private entity: Entity;
  private storeManager: StoreManager;

  constructor($element: HTMLCanvasElement) {
    const canvasEntity = new Canvas($element);
    this.entity = canvasEntity;
  }

  start(): void {
    // start listening events
    this._startEvents();
  }

  private _startEvents(): void {
    this._createStore();
    this._createGlobalEvents();
    this._createTargetEvents();
  }

  private _createStore(): void {
    // create storeManager
    const storeManager = new StoreManager();
    storeManager.init(this.entity);
    this.storeManager = storeManager;
  }

  private _createGlobalEvents(): void {
    // create globalEvents
    const globalNotifier = new Notifier<FilterResult>();
    globalNotifier.notifyType = NOTIFY_TYPE.GLOBAL;
    const globalEvents = new GlobalEvents(globalNotifier);
    // start eventListener
    globalEvents.init(this.entity);
    // start eventListener
    globalEvents.start();

    // subscribe a notifier's obeserver
    this._observe(globalNotifier);
  }

  private _createTargetEvents(): void {
    // create targetEvents
    const targetNotifier = new Notifier<FilterResult>();
    targetNotifier.notifyType = NOTIFY_TYPE.TARGET;
    const targetEvents = new TargetEvents(targetNotifier);
    // start eventListener
    targetEvents.init(this.entity);
    // observe events data
    targetEvents.start();

    // subscribe a notifier's obeserver
    this._observe(targetNotifier);
  }

  private _observe($notifier: Notifier<FilterResult>): void {
    $notifier.observer().subscribe((e) => {
      const eventType: string = e.content.eventType;
      const flags: any = e.content.flags; // eslint-disable-line @typescript-eslint/no-explicit-any
      const values: any = e.content.values; // eslint-disable-line @typescript-eslint/no-explicit-any

      // update notifyType
      this.storeManager.updateNotifyType(e.type);
      console.log(this.storeManager.notifyType);

      if (eventType === EVENT_TYPE.CLIPBOARD) {
        this._clipboard(flags, values);
      } else if (eventType === EVENT_TYPE.KEYBOARD) {
        this._keyboard(flags, values);
      } else if (eventType === EVENT_TYPE.POINTER) {
        this._pointer(flags, values);
      } else if (eventType === EVENT_TYPE.DRAG) {
        this._drag(flags, values);
      } else if (eventType === EVENT_TYPE.EVENT) {
        this._event(flags, values);
      } else if (eventType === EVENT_TYPE.MOUSE) {
        this._mouse(flags, values);
      } else if (eventType === EVENT_TYPE.WHEEL) {
        this._wheel(flags, values);
      }
    });
  }

  private _clipboard($flags: ClipboardFlags, $values: ClipboardValues): void {}
  private _keyboard($flags: KeyboardFlags, $values: KeyboardValues): void {}

  private _pointer($flags: PointerFlags, $values: PointerValues): void {
    this.storeManager.updatePointerFlags($flags);
    this.storeManager.updatePointerOffset($flags, $values);
  }

  private _drag($flags: DragFlags, $values: DragValues): void {}
  private _event($flags: EventFlags, $values: EventValues): void {}
  private _mouse($flags: MouseFlags, $values: MouseValues): void {}
  private _wheel($flags: WheelFlags, $values: WheelValues): void {}
}
