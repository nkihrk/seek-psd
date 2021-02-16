/* eslint @typescript-eslint/no-explicit-any: 0 */

export interface FilterResult {
  default: any;
  flags: any;
  values: any;
}

export abstract class MetaFilter {
  abstract get flags(): any;
  abstract get values(): any;
  abstract init($event: any): void;
}
