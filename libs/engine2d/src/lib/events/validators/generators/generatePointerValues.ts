export interface PointerValues {}

export class GeneratePointerValues {
  private _values: PointerValues;

  constructor($event: PointerEvent) {}

  get values(): PointerValues {
    return this._values;
  }
}
