/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { Entity } from './entities/entity';
import type {
  ClipboardFlags,
  ClipboardValues,
} from './events/meta-filters/clipboardMetaFilter';
import {
  KeyboardFlags,
  KeyboardValues,
} from './events/meta-filters/keyboardMetaFilter';
import type {
  Coord,
  PointerFlags,
  PointerValues,
} from './events/meta-filters/pointerMetaFilter';
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
import type { IPointerOffset } from './store';
import { Store } from './store';
import { EVENT_TYPE } from './constants';

export class StoreManager extends Store {
  static registerPlugin($userStore: any): void {
    Store._userStore = $userStore;
  }

  constructor() {
    super();
  }

  initEntity($entity: Entity): void {
    this._entity = $entity;
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
    this._notifyType = $notifyType;
  }

  updateDefaultEvent($defaultEvent: any): void {
    this._defaultEvent = $defaultEvent;
  }

  updateClipboardFlags($flags: ClipboardFlags): void {
    this._flags.clipboard = $flags;
  }

  updateClipboardData($values: ClipboardValues): void {
    this._values.clipboard.data = $values.data;
  }

  updateKeyboardFlags($flags: KeyboardFlags): void {
    this._flags.keyboard = $flags;
  }

  updateKeyboardValues($values: KeyboardValues): void {
    this._values.keyboard = $values;
  }

  updatePointerFlags($flags: PointerFlags): void {
    this._flags.pointer = $flags;
  }

  updatePointerOffset($flags: PointerFlags, $values: PointerValues): void {
    const flags: PointerFlags = $flags;
    const values: PointerValues = $values;
    const elem: HTMLElement = this.entity.element;
    const rect: DOMRect = elem.getBoundingClientRect();

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

      this._values.pointer = pointerOffset;
    } else {
      const pointerOffset: IPointerOffset = Object.assign(
        {},
        this._values.pointer,
        {
          current: currentOffset,
          raw: rawOffset,
          tmp: tmpOffset,
        }
      );

      this._values.pointer = pointerOffset;
    }
  }

  updateDragFlags($flags: DragFlags): void {
    this._flags.drag = $flags;
  }

  updateDragData($values: DragValues): void {
    this._values.drag.data = $values.data;
  }

  updateEventFlgas($flags: EventFlags): void {
    this._flags.event = $flags;
  }

  updateEventValues($values: EventValues): void {
    this._values.event = $values;
  }

  updateMouseFlags($flags: MouseFlags): void {
    this._flags.mouse = $flags;
  }

  updateMouseValues($values: MouseValues): void {
    this._values.mouse = $values;
  }

  updateWheelFlags($flags: WheelFlags): void {
    this._flags.wheel = $flags;
  }

  updateWheelValues($values: WheelValues): void {
    this._values.wheel = $values;
  }
}
