import type { FilterResult } from './events/event/event';
import type { NotifiedEvent } from './notifiers/notifier';
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
import { PluginManager } from './pluginManager';

export class EventManager {
  private storeManager: StoreManager = null;
  private pluginManager: PluginManager = null;

  constructor() {}

  init($storeManager: StoreManager, $pluginManager: PluginManager): void {
    this.storeManager = $storeManager;
    this.pluginManager = $pluginManager;
  }

  start(): void {
    if (!this.storeManager) {
      throw new Error('EventManager is not properly initialized.');
    }

    // start listening events
    this._startEvents();
  }

  private _startEvents(): void {
    this._createGlobalEvents();
    this._createTargetEvents();
  }

  private _createGlobalEvents(): void {
    // create globalEvents
    const globalNotifier = new Notifier<FilterResult>();
    globalNotifier.notifyType = NOTIFY_TYPE.GLOBAL;
    const globalEvents = new GlobalEvents(globalNotifier);
    globalEvents.init(this.storeManager.entity);
    globalEvents.start();

    // subscribe a notifier's obeserver
    this._observe(globalNotifier);
  }

  private _createTargetEvents(): void {
    // create targetEvents
    const targetNotifier = new Notifier<FilterResult>();
    targetNotifier.notifyType = NOTIFY_TYPE.TARGET;
    const targetEvents = new TargetEvents(targetNotifier);
    targetEvents.init(this.storeManager.entity);
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
    //console.log(this.storeManager.notifyType);

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

    this.pluginManager.searchByEventType(EVENT_TYPE.CLIPBOARD).forEach((f) => {
      f.plugin.call(this.storeManager);
    });
  }

  private _keyboard($flags: KeyboardFlags, $values: KeyboardValues): void {
    this.storeManager.updateKeyboardFlags($flags);
    this.storeManager.updateKeyboardValues($values);

    this.pluginManager.searchByEventType(EVENT_TYPE.KEYBOARD).forEach((f) => {
      f.plugin.call(this.storeManager);
    });
  }

  private _pointer($flags: PointerFlags, $values: PointerValues): void {
    this.storeManager.updatePointerFlags($flags);
    this.storeManager.updatePointerOffset($flags, $values);

    this.pluginManager.searchByEventType(EVENT_TYPE.POINTER).forEach((f) => {
      f.plugin.call(this.storeManager);
    });
  }

  private _drag($flags: DragFlags, $values: DragValues): void {
    this.storeManager.updateDragFlags($flags);
    this.storeManager.updateDragValues($values);

    this.pluginManager.searchByEventType(EVENT_TYPE.DRAG).forEach((f) => {
      f.plugin.call(this.storeManager);
    });
  }

  private _event($flags: EventFlags, $values: EventValues): void {
    this.storeManager.updateEventFlgas($flags);
    this.storeManager.updateEventValues($values);

    this.pluginManager.searchByEventType(EVENT_TYPE.EVENT).forEach((f) => {
      f.plugin.call(this.storeManager);
    });
  }

  private _mouse($flags: MouseFlags, $values: MouseValues): void {
    this.storeManager.updateMouseFlags($flags);
    this.storeManager.updateMouseValues($values);

    this.pluginManager.searchByEventType(EVENT_TYPE.MOUSE).forEach((f) => {
      f.plugin.call(this.storeManager);
    });
  }

  private _wheel($flags: WheelFlags, $values: WheelValues): void {
    this.storeManager.updateWheelFlags($flags);
    this.storeManager.updateWheelValues($values);

    this.pluginManager.searchByEventType(EVENT_TYPE.WHEEL).forEach((f) => {
      f.plugin.call(this.storeManager);
    });
  }
}
