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
import type { PointerOffset } from './store';
import { Store } from './store';

import { EVENT_TYPE } from './constants';

export class StoreManager extends Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static registerPlugin($store: any): void {
    // combine a main store with the backend store
    Object.setPrototypeOf(Store.prototype, $store);
  }

  constructor() {
    super();
  }

  init($entity: Entity): void {
    this._entity = $entity;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateValues($eventType: string, $values: any): void {
    switch ($eventType) {
      case EVENT_TYPE.CLIPBOARD:
        this.updateClipboardValues($values);
        break;

      case EVENT_TYPE.KEYBOARD:
        this.updateKeyboardValues($values);
        break;

      case EVENT_TYPE.POINTER:
        break;

      case EVENT_TYPE.DRAG:
        this.updateDragValues($values);
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

  updateClipboardFlags($flags: ClipboardFlags): void {
    this._clipboardFlags = $flags;
  }

  updateClipboardValues($values: ClipboardValues): void {
    this._clipboardValues = $values;
  }

  updateKeyboardFlags($flags: KeyboardFlags): void {
    this._keyboardFlags = $flags;
  }

  updateKeyboardValues($values: KeyboardValues): void {
    this._keyboardValues = $values;
  }

  updatePointerFlags($flags: PointerFlags): void {
    this._pointerFlags = $flags;
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
      const pointerOffset: PointerOffset = {
        current: currentOffset,
        prev: currentOffset,
        raw: rawOffset,
        tmp: tmpOffset,
      };

      this._pointerOffset = pointerOffset;
    } else {
      const pointerOffset: PointerOffset = Object.assign(
        {},
        this._pointerOffset,
        {
          current: currentOffset,
          raw: rawOffset,
          tmp: tmpOffset,
        }
      );

      this._pointerOffset = pointerOffset;
    }
  }

  updateDragFlags($flags: DragFlags): void {
    this._dragFlags = $flags;
  }

  updateDragValues($values: DragValues): void {
    this._dragValues = $values;
  }

  updateEventFlgas($flags: EventFlags): void {
    this._eventFlags = $flags;
  }

  updateEventValues($values: EventValues): void {
    this._eventValues = $values;
  }

  updateMouseFlags($flags: MouseFlags): void {
    this._mouseFlags = $flags;
  }

  updateMouseValues($values: MouseValues): void {
    this._mouseValues = $values;
  }

  updateWheelFlags($flags: WheelFlags): void {
    this._wheelFlags = $flags;
  }

  updateWheelValues($values: WheelValues): void {
    this._wheelValues = $values;
  }
}
