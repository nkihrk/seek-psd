import { MetaFilter } from './metaFilter';
import { BUTTON_STATES, POINTER } from '../../constants/index';
import { getButtonValue, getButtonsValue } from './utils/index';

export interface PointerFlags {
  meta: PointerMetaFlags;
  base: PointerBaseFlags;
  state: PointerStateFlags;
}

export interface PointerMetaFlags {
  isPrimary: boolean;
  isTouch: boolean;
  isMultiTouch: boolean;
  isAltKey: boolean;
  isCtrlKey: boolean;
  isMetaKey: boolean;
  isShiftKey: boolean;
}

export interface PointerBaseFlags {
  isDown: boolean;
  isUp: boolean;
  isMove: boolean;
  isOver: boolean;
  isEnter: boolean;
  isCancel: boolean;
  isOut: boolean;
  isLeave: boolean;
}

export interface PointerStateFlags {
  isRightDown: boolean;
  isRightUp: boolean;
  isRightMove: boolean;
  isLeftDown: boolean;
  isLeftUp: boolean;
  isLeftMove: boolean;
  isMiddleDown: boolean;
  isMiddleUp: boolean;
  isMiddleMove: boolean;
  isBackDown: boolean;
  isBackUp: boolean;
  isBackMove: boolean;
  isForwardDown: boolean;
  isForwardUp: boolean;
  isForwardMove: boolean;
  isEraserDown: boolean;
  isEraserUp: boolean;
  isEraserMove: boolean;
}

export interface PointerValues {
  meta: PointerMetaValues;
  pressure: PointerPressureValues;
  tilt: Coord;
  twist: number;
  client: Coord;
  tmpClient: Coord;
  movement: Coord;
  touch: Coord; // a center coordinate of two clients
  button: string;
  buttons: string[];
}

export interface Coord {
  x: number;
  y: number;
}

export interface PointerMetaValues {
  id: number;
  type: string;
}

export interface PointerPressureValues {
  normal: number;
  tangential: number;
}

export class PointerMetaFilter extends MetaFilter<PointerFlags, PointerValues> {
  constructor() {
    super();
  }

  protected generateFlags($event: PointerEvent): PointerFlags {
    const meta: PointerMetaFlags = this._generateMetaFlags($event);
    const base: PointerBaseFlags = this._generateBaseFlags($event);
    const state: PointerStateFlags = this._generateStateFlags($event);

    return { meta, base, state };
  }

  protected generateValues($event: PointerEvent): PointerValues {
    const meta: PointerMetaValues = {
      id: $event.pointerId,
      type: $event.pointerType,
    };
    const pressure: PointerPressureValues = {
      normal: $event.pressure,
      tangential: $event.tangentialPressure,
    };
    const tilt: Coord = { x: $event.clientX, y: $event.clientY };
    const twist: number = $event.twist;
    const client: Coord = { x: $event.clientX, y: $event.clientY };
    const tmpClient: Coord = { x: $event.clientX, y: $event.clientY };
    const movement: Coord = { x: $event.movementX, y: $event.movementY };
    const touch = {} as Coord;
    const button: string = getButtonValue($event.button);
    const buttons: string[] = getButtonsValue($event.buttons);

    return {
      meta,
      pressure,
      tilt,
      twist,
      client,
      tmpClient,
      movement,
      touch,
      button,
      buttons,
    };
  }

  private _generateMetaFlags($event: PointerEvent): PointerMetaFlags {
    const meta: PointerMetaFlags = {
      isPrimary: $event.isPrimary,
      isTouch: $event.pointerType === 'touch',
      isMultiTouch: false, // will be changed at onPointerEvent
      isAltKey: $event.altKey,
      isCtrlKey: $event.ctrlKey,
      isMetaKey: $event.metaKey,
      isShiftKey: $event.shiftKey,
    };

    return meta;
  }

  private _generateBaseFlags($event: PointerEvent): PointerBaseFlags {
    const base = {} as PointerBaseFlags;

    switch ($event.type) {
      case POINTER.DOWN:
        base.isDown = true;
        break;

      case POINTER.UP:
        base.isUp = true;
        break;

      case POINTER.MOVE:
        base.isMove = true;
        break;

      case POINTER.OVER:
        base.isOver = true;
        break;

      case POINTER.ENTER:
        base.isEnter = true;
        break;

      case POINTER.CANCEL:
        base.isCancel = true;
        break;

      case POINTER.OUT:
        base.isOut = true;
        break;

      case POINTER.LEAVE:
        base.isLeave = true;
        break;
    }

    return base;
  }

  private _generateStateFlags($event: PointerEvent): PointerStateFlags {
    let buttonType = '';
    let state = {} as PointerStateFlags;

    switch ($event.button) {
      case BUTTON_STATES.LEFT:
        buttonType = 'Left';
        break;

      case BUTTON_STATES.MIDDLE:
        buttonType = 'Middle';
        break;

      case BUTTON_STATES.RIGHT:
        buttonType = 'Right';
        break;

      case BUTTON_STATES.BACK:
        buttonType = 'Back';
        break;

      case BUTTON_STATES.FORWARD:
        buttonType = 'Forward';
        break;

      case BUTTON_STATES.ERASER:
        buttonType = 'Eraser';
        break;
    }

    if (buttonType) {
      state = this._generateDownUpMoveFlags($event.type, buttonType, state);
    }

    return state;
  }

  private _generateDownUpMoveFlags(
    $type: string,
    $buttonType: string,
    $flags: PointerStateFlags
  ): PointerStateFlags {
    const flags: PointerStateFlags = Object.assign({}, $flags);

    if ($type === POINTER.DOWN) {
      flags[`is${$buttonType}Down`] = true;
    } else if ($type === POINTER.UP) {
      flags[`is${$buttonType}Up`] = true;
    }

    return flags;
  }
}
