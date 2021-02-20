import type { Entity } from './entities/entity.interface';
import type { PointerOffset } from './store.interface';

export abstract class Store {
  protected _entity: Entity;
  protected _pointerOffset: PointerOffset = {
    current: {
      x: -Infinity,
      y: -Infinity,
    },
    prev: {
      x: -Infinity,
      y: -Infinity,
    },
    raw: {
      x: -Infinity,
      y: -Infinity,
    },
    tmp: {
      x: -Infinity,
      y: -Infinity,
    },
  };

  constructor($entity: Entity) {
    this._entity = $entity;
  }

  get entity(): Entity {
    return this._entity;
  }

  get pointerOffset(): PointerOffset {
    return this._pointerOffset;
  }
}
