import { MetaFilter } from './metaFilter';

export interface WheelFlags {
  isWheelStart: boolean;
}

export interface WheelValues {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

export class WheelMetaFilter extends MetaFilter {
  private _flags = {} as WheelFlags;
  private _values = {} as WheelValues;

  constructor() {
    super();
  }

  get flags(): WheelFlags {
    return this._flags;
  }

  get values(): WheelValues {
    return this._values;
  }

  init($event: WheelEvent): void {
    this._flags = this._generateFlags();
    this._values = this._generateValues($event);
  }

  private _generateFlags(): WheelFlags {
    return { isWheelStart: false };
  }

  private _generateValues($event: WheelEvent): WheelValues {
    const values: WheelValues = {
      deltaX: $event.deltaX,
      deltaY: $event.deltaY,
      deltaZ: $event.deltaZ,
    };

    return values;
  }
}
