import { CommonValidator } from './commonValidator';
import { BUTTON_STATES, POINTER } from '../../constants/constants';

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
  rightmove: boolean;
  leftdown: boolean;
  leftup: boolean;
  leftmove: boolean;
  middledown: boolean;
  middleup: boolean;
  middlemove: boolean;
}

export interface PointerValues {}

export class PointerValidator extends CommonValidator {
  private _flags: PointerFlags;
  private _values: PointerValues;

  constructor($event: PointerEvent) {
    super();
    this._flags = this._generateFlags($event);
    this._values = this._generateValues($event);
  }

  get flags(): PointerFlags {
    return this._flags;
  }

  get values(): PointerValues {
    return this._values;
  }

  private _generateFlags($event: PointerEvent): PointerFlags {
    console.log($event.button);

    switch ($event.button) {
      case BUTTON_STATES.NO_CHANGE:
        break;

      case BUTTON_STATES.LEFT:
        console.log('左クリック');
        break;

      case BUTTON_STATES.MIDDLE:
        break;

      case BUTTON_STATES.RIGHT:
        break;

      case BUTTON_STATES.BACK:
        break;

      case BUTTON_STATES.FORWARD:
        break;

      case BUTTON_STATES.ERASER:
        break;
    }

    return undefined;
  }

  private _generateValues($event: PointerEvent): PointerValues {
    return undefined;
  }
}
