import type { Entity } from './entities/entity.interface';
import type { PointerOffset } from './store.interface';
import type { PointerFlags } from './events/meta-filters/pointerMetaFilter';
import { NOTIFY_TYPE } from './constants/index';

export abstract class Store {
  protected _notifyType: string = NOTIFY_TYPE.GLOBAL;
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
  protected _pointerFlags = {} as PointerFlags;

  constructor() {}

  init($entity: Entity): void {
    this._entity = $entity;
  }

  get notifyType(): string {
    return this._notifyType;
  }

  get entity(): Entity {
    return this._entity;
  }

  get pointerOffset(): PointerOffset {
    return this._pointerOffset;
  }

  get pointerFlags(): PointerFlags {
    return this._pointerFlags;
  }
}
