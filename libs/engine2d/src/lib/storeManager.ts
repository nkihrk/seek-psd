/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { Entity } from './entities/entity';
import type {
  IClipboardFlags,
  IClipboardValues,
} from './events/meta-filters/clipboardMetaFilter';
import {
  IKeyboardFlags,
  IKeyboardValues,
} from './events/meta-filters/keyboardMetaFilter';
import type {
  ICoord,
  IPointerFlags,
  IPointerValues,
} from './events/meta-filters/pointerMetaFilter';
import type {
  IDragFlags,
  IDragValues,
} from './events/meta-filters/dragMetaFilter';
import type {
  IEventFlags,
  IEventValues,
} from './events/meta-filters/eventMetaFilter';
import type {
  IMouseFlags,
  IMouseValues,
} from './events/meta-filters/mouseMetaFilter';
import type {
  IWheelFlags,
  IWheelValues,
} from './events/meta-filters/wheelMetaFilter';
import type { IPointerOffset } from './store';
import type { IStore } from './store';
import { Store } from './store';
import { EVENT_TYPE } from './constants';
import { Notifier } from './notifiers/notifier';

export class StoreManager {
  private _store = new Store();
  private _userStore = null;
  readonly updateNotifier = new Notifier();

  private flagUpdator = {
    [EVENT_TYPE.CLIPBOARD]: (f) => this.updateClipboardFlags(f),
    [EVENT_TYPE.KEYBOARD]: (f) => this.updateKeyboardFlags(f),
    [EVENT_TYPE.POINTER]: (f) => this.updatePointerFlags(f),
    [EVENT_TYPE.DRAG]: (f) => this.updateDragFlags(f),
    [EVENT_TYPE.EVENT]: (f) => this.updateEventFlgas(f),
    [EVENT_TYPE.MOUSE]: (f) => this.updateMouseFlags(f),
    [EVENT_TYPE.WHEEL]: (f) => this.updateWheelFlags(f),
  };

  private valueUpdator = {
    [EVENT_TYPE.CLIPBOARD]: (v) => this.updateClipboardData(v),
    [EVENT_TYPE.KEYBOARD]: (v) => this.updateKeyboardValues(v),
    [EVENT_TYPE.POINTER]: (v) => {},
    [EVENT_TYPE.DRAG]: (v) => this.updateDragData(v),
    [EVENT_TYPE.EVENT]: (v) => this.updateEventValues(v),
    [EVENT_TYPE.MOUSE]: (v) => this.updateMouseValues(v),
    [EVENT_TYPE.WHEEL]: (v) => this.updateWheelValues(v),
  };

  constructor() {}

  get store(): IStore {
    return this._store;
  }

  get userStore(): any {
    return this._userStore;
  }

  registerEntity($entity: Entity): void {
    this._store.entity = $entity;
  }

  registerStore($userStore: any): void {
    this._userStore = $userStore;
  }

  updateFlags($eventType: string, $flags: any): void {
    if (this.flagUpdator[$eventType]) {
      this.flagUpdator[$eventType]($flags);
    } else {
      throw new Error('Invalid event type is detected.');
    }
  }

  updateValues($eventType: string, $values: any): void {
    if (this.valueUpdator[$eventType]) {
      this.valueUpdator[$eventType]($values);
    } else {
      throw new Error('Invalid event type is detected.');
    }
  }

  updateNotifyType($notifyType: string): void {
    this._store.notifyType = $notifyType;
  }

  updateDefaultEvent($defaultEvent: any): void {
    this._store.defaultEvent = $defaultEvent;
  }

  updateClipboardFlags($flags: IClipboardFlags): void {
    this._store.flags.clipboard = $flags;
  }

  updateClipboardData($values: IClipboardValues): void {
    this._store.values.clipboard.data = $values.data;
  }

  updateKeyboardFlags($flags: IKeyboardFlags): void {
    this._store.flags.keyboard = $flags;
  }

  updateKeyboardValues($values: IKeyboardValues): void {
    this._store.values.keyboard = $values;
  }

  updatePointerFlags($flags: IPointerFlags): void {
    this._store.flags.pointer = $flags;
  }

  updatePointerOffset($flags: IPointerFlags, $values: IPointerValues): void {
    const flags: IPointerFlags = $flags;
    const values: IPointerValues = $values;
    const rect:
      | DOMRect
      | {
          x: number;
          y: number;
        } = this._store.entity?.element.getBoundingClientRect() || {
      x: 0,
      y: 0,
    };
    const storePointer: IPointerOffset = this._store.values.pointer;

    const currentOffset: ICoord = {
      x: values.client.x - rect.x,
      y: values.client.y - rect.y,
    };
    const diffOffset: ICoord = {
      x: currentOffset.x - this._store.values.pointer.prev.x,
      y: currentOffset.y - this._store.values.pointer.prev.y,
    };
    const rawOffset: ICoord = {
      x: values.client.x,
      y: values.client.y,
    };
    const tmpOffset: ICoord = {
      x: values.tmpClient.x - rect.x,
      y: values.tmpClient.y - rect.y,
    };

    let pointerOffset: IPointerOffset = {
      current: currentOffset,
      diff: diffOffset,
      raw: rawOffset,
      tmp: tmpOffset,
      prev: storePointer.prev,
    };

    if (flags.base.isDown || flags.base.isUp) {
      pointerOffset = Object.assign({}, pointerOffset, {
        prev: currentOffset,
        diff: { x: 0, y: 0 },
      });
    } else if (flags.base.isDownMove) {
      pointerOffset = Object.assign({}, pointerOffset, {
        diff: diffOffset,
      });
    }

    // update the store
    this._store.values.pointer = Object.assign({}, storePointer, pointerOffset);
  }

  updateDragFlags($flags: IDragFlags): void {
    this._store.flags.drag = $flags;
  }

  updateDragData($values: IDragValues): void {
    this._store.values.drag.data = $values.data;
  }

  updateEventFlgas($flags: IEventFlags): void {
    this._store.flags.event = $flags;
  }

  updateEventValues($values: IEventValues): void {
    this._store.values.event = $values;
  }

  updateMouseFlags($flags: IMouseFlags): void {
    this._store.flags.mouse = $flags;
  }

  updateMouseValues($values: IMouseValues): void {
    this._store.values.mouse = $values;
  }

  updateWheelFlags($flags: IWheelFlags): void {
    this._store.flags.wheel = $flags;
  }

  updateWheelValues($values: IWheelValues): void {
    this._store.values.wheel = $values;
  }
}
