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
  Coord,
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
import { Store } from './store';
import { EVENT_TYPE } from './constants';

export class StoreManager {
  private _store = new Store();
  private _userStore = null;

  constructor() {}

  get store(): Store {
    return this._store;
  }

  get userStore(): any {
    return this._userStore;
  }

  initEntity($entity: Entity): void {
    this._store.entity = $entity;
  }

  registerStore($userStore: any): void {
    this._userStore = $userStore;
  }

  updateFlags($eventType: string, $flags: any): void {
    switch ($eventType) {
      case EVENT_TYPE.CLIPBOARD:
        this.updateClipboardFlags($flags);
        break;

      case EVENT_TYPE.KEYBOARD:
        this.updateKeyboardFlags($flags);
        break;

      case EVENT_TYPE.POINTER:
        this.updatePointerFlags($flags);
        break;

      case EVENT_TYPE.DRAG:
        this.updateDragFlags($flags);
        break;

      case EVENT_TYPE.EVENT:
        this.updateEventFlgas($flags);
        break;

      case EVENT_TYPE.MOUSE:
        this.updateMouseFlags($flags);
        break;

      case EVENT_TYPE.WHEEL:
        this.updateWheelFlags($flags);
        break;

      default:
        throw new Error('Invalid event type is detected.');
        break;
    }
  }

  updateValues($eventType: string, $values: any): void {
    switch ($eventType) {
      case EVENT_TYPE.CLIPBOARD:
        this.updateClipboardData($values);
        break;

      case EVENT_TYPE.KEYBOARD:
        this.updateKeyboardValues($values);
        break;

      case EVENT_TYPE.POINTER:
        break;

      case EVENT_TYPE.DRAG:
        this.updateDragData($values);
        break;

      case EVENT_TYPE.EVENT:
        this.updateEventFlgas($values);
        break;

      case EVENT_TYPE.MOUSE:
        this.updateMouseValues($values);
        break;

      case EVENT_TYPE.WHEEL:
        this.updateWheelValues($values);
        break;

      default:
        throw new Error('Invalid event type is detected.');
        break;
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

    const currentOffset: Coord = {
      x: values.client.x - rect.x,
      y: values.client.y - rect.y,
    };
    const rawOffset: Coord = {
      x: values.client.x,
      y: values.client.y,
    };
    const tmpOffset: Coord = {
      x: values.tmpClient.x - rect.x,
      y: values.tmpClient.y - rect.y,
    };

    if (flags.base.isDown) {
      const pointerOffset: IPointerOffset = {
        current: currentOffset,
        prev: currentOffset,
        raw: rawOffset,
        tmp: tmpOffset,
      };

      this._store.values.pointer = pointerOffset;
    } else {
      const pointerOffset: IPointerOffset = Object.assign(
        {},
        this._store.values.pointer,
        {
          current: currentOffset,
          raw: rawOffset,
          tmp: tmpOffset,
        }
      );

      this._store.values.pointer = pointerOffset;
    }
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
