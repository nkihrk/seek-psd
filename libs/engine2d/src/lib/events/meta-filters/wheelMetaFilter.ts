import { MetaFilter } from './metaFilter';

export interface WheelFlags {}

export interface WheelValues {}

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
    this._flags = this._generateFlags($event);
    this._values = this._generateValues($event);
  }

  private _generateFlags($event: WheelEvent): WheelFlags {
    return undefined;
  }

  private _generateValues($event: WheelEvent): WheelValues {
    return undefined;
  }
}
