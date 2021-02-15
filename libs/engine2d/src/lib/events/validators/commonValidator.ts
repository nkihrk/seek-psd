import type { PointerFlags } from './generators/generatePointerFlags';
import type { PointerValues } from './generators/generatePointerValues';

type Flags = PointerFlags;
type Values = PointerValues;

export abstract class CommonValidator {
  abstract get flags(): Flags;
  abstract get values(): Values;
}
