import type { PointerFlags } from './generators/generatePointerFlags';
import type { PointerValues } from './generators/generatePointerValues';
import { CommonValidator } from './commonValidator';
import { GeneratePointerFlags } from './generators/generatePointerFlags';
import { GeneratePointerValues } from './generators/generatePointerValues';

export class PointerValidator extends CommonValidator {
  private _flags: PointerFlags;
  private _values: PointerValues;

  constructor($event: PointerEvent) {
    super();
    this._flags = new GeneratePointerFlags($event).flags;
    this._values = new GeneratePointerValues($event).values;
  }

  get flags(): PointerFlags {
    return this._flags;
  }

  get values(): PointerValues {
    return this._values;
  }
}
