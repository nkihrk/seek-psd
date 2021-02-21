import type {
  Coord,
  PointerFlags,
  PointerValues,
} from './events/meta-filters/pointerMetaFilter';
import type { PointerOffset } from './store.interface';
import { Store } from './store';

export class StoreManager extends Store {
  constructor() {
    super();
  }

  updateNotifyType($notifyType: string): void {
    this._notifyType = $notifyType;
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
}
