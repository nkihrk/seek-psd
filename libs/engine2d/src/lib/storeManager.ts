import type { Entity } from './entities/entity.interface';
import type {
  Coord,
  PointerFlags,
  PointerValues,
} from './events/meta-filters/pointerMetaFilter';
import { Store } from './store';

export class StoreManager extends Store {
  constructor($entity: Entity) {
    super($entity);
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
      this._pointerOffset = {
        current: currentOffset,
        prev: currentOffset,
        raw: rawOffset,
        tmp: tmpOffset,
      };
    } else {
      this._pointerOffset = Object.assign({}, this.pointerOffset, {
        current: currentOffset,
        raw: rawOffset,
        tmp: tmpOffset,
      });
    }
  }
}
