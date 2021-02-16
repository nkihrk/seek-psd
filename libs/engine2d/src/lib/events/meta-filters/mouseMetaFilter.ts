import { MetaFilter } from './metaFilter';

export interface MouseFlags {}

export interface MouseValues {}

export class MouseMetaFilter extends MetaFilter {
  private _flags = {} as MouseFlags;
  private _values = {} as MouseValues;

  constructor() {
    super();
  }

  get flags(): MouseFlags {
    return this._flags;
  }

  get values(): MouseValues {
    return this._values;
  }

  init($event: MouseEvent): void {
    this._flags = this._generateFlags($event);
    this._values = this._generateValues($event);
  }

  private _generateFlags($event: MouseEvent): MouseFlags {
    return undefined;
  }

  private _generateValues($event: MouseEvent): MouseValues {
    return undefined;
  }
}
