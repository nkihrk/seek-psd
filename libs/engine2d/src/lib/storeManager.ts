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
import type { PointerOffset } from './store.interface';
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
import { Store } from './store';

export class StoreManager extends Store {
  constructor() {
    super();
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
