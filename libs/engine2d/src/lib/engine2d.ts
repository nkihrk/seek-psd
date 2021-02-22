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
import { NotifiedEvent, Notifier } from './notifiers/notifier';
import { GlobalEvents } from './events/globalEvents';
import { TargetEvents } from './events/targetEvents';
import { StoreManager } from './storeManager';

type Plugin = ($mainStore: any, $store: StoreManager) => void;

export class Engine2D {
  private entity: Entity;
  private storeManager: StoreManager;
  private static mainStore: any;
  private static clipboards: Plugin[] = [];
  private static keyboards: Plugin[] = [];
  private static pointers: Plugin[] = [];
  private static drags: Plugin[] = [];
  private static events: Plugin[] = [];
  private static mouses: Plugin[] = [];
  private static wheels: Plugin[] = [];

  constructor($entity: Entity) {
    this.entity = $entity;
  }

  static registerPlugin($eventType: string, $callback: Plugin): void {
    switch ($eventType) {
      case EVENT_TYPE.CLIPBOARD:
        this.clipboards.push($callback);
        break;

      case EVENT_TYPE.KEYBOARD:
        this.keyboards.push($callback);
        break;

      case EVENT_TYPE.POINTER:
        this.pointers.push($callback);
        break;

      case EVENT_TYPE.DRAG:
        this.drags.push($callback);
        break;

      case EVENT_TYPE.EVENT:
        this.events.push($callback);
        break;

      case EVENT_TYPE.MOUSE:
        this.mouses.push($callback);
        break;

      case EVENT_TYPE.WHEEL:
        this.wheels.push($callback);
        break;

      default:
        throw new Error('Invalid plugin category is detected.');
        break;
    }
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
    globalEvents.init(this.entity);
    globalEvents.start();

    // subscribe a notifier's obeserver
    this._observe(globalNotifier);
  }

  private _createTargetEvents(): void {
    // create targetEvents
    const targetNotifier = new Notifier<FilterResult>();
    targetNotifier.notifyType = NOTIFY_TYPE.TARGET;
    const targetEvents = new TargetEvents(targetNotifier);
    targetEvents.init(this.entity);
    targetEvents.start();

    // subscribe a notifier's obeserver
    this._observe(targetNotifier);
  }

  private _observe($notifier: Notifier<FilterResult>): void {
    $notifier.observer().subscribe((e) => {
      this._updateBackendStore(e);
    });
  }

  private _updateBackendStore($e: NotifiedEvent) {
    const eventType: string = $e.content.eventType;
    const flags: any = $e.content.flags; // eslint-disable-line @typescript-eslint/no-explicit-any
    const values: any = $e.content.values; // eslint-disable-line @typescript-eslint/no-explicit-any

    // update notifyType
    this.storeManager.updateNotifyType($e.type);

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
  }

  private _clipboard($flags: ClipboardFlags, $values: ClipboardValues): void {
    this.storeManager.updateClipboardFlags($flags);
    this.storeManager.updateClipboardValues($values);

    Engine2D.clipboards.forEach((f) => {
      f(Engine2D.mainStore, this.storeManager);
    });
  }

  private _keyboard($flags: KeyboardFlags, $values: KeyboardValues): void {
    this.storeManager.updateKeyboardFlags($flags);
    this.storeManager.updateKeyboardValues($values);

    Engine2D.keyboards.forEach((f) => {
      f(Engine2D.mainStore, this.storeManager);
    });
  }

  private _pointer($flags: PointerFlags, $values: PointerValues): void {
    this.storeManager.updatePointerFlags($flags);
    this.storeManager.updatePointerOffset($flags, $values);

    Engine2D.pointers.forEach((f) => {
      f(Engine2D.mainStore, this.storeManager);
    });
  }

  private _drag($flags: DragFlags, $values: DragValues): void {
    this.storeManager.updateDragFlags($flags);
    this.storeManager.updateDragValues($values);

    Engine2D.drags.forEach((f) => {
      f(Engine2D.mainStore, this.storeManager);
    });
  }

  private _event($flags: EventFlags, $values: EventValues): void {
    this.storeManager.updateEventFlgas($flags);
    this.storeManager.updateEventValues($values);

    Engine2D.events.forEach((f) => {
      f(Engine2D.mainStore, this.storeManager);
    });
  }

  private _mouse($flags: MouseFlags, $values: MouseValues): void {
    this.storeManager.updateMouseFlags($flags);
    this.storeManager.updateMouseValues($values);

    Engine2D.mouses.forEach((f) => {
      f(Engine2D.mainStore, this.storeManager);
    });
  }

  private _wheel($flags: WheelFlags, $values: WheelValues): void {
    this.storeManager.updateWheelFlags($flags);
    this.storeManager.updateWheelValues($values);

    Engine2D.wheels.forEach((f) => {
      f(Engine2D.mainStore, this.storeManager);
    });
  }
}
