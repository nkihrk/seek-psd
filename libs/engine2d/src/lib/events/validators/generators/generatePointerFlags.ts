import { BUTTON_STATES } from '../../../constants/constants';

export interface PointerFlags extends PointerConditionFlags {
  down: boolean;
  up: boolean;
  move: boolean;
  over: boolean;
  enter: boolean;
  cancel: boolean;
  out: boolean;
  leave: boolean;
}

export interface PointerConditionFlags {
  rightdown: boolean;
  rightup: boolean;
  leftdown: boolean;
  leftup: boolean;
  middledown: boolean;
  middleup: boolean;
}

export class GeneratePointerFlags {
  private _flags: PointerFlags;

  constructor($event: PointerEvent) {
    console.log($event.button);
  }

  get flags(): PointerFlags {
    return this._flags;
  }
}
