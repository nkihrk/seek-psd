import { MetaFilter } from './metaFilter';
import { BUTTON_STATES, POINTER } from '../../constants/index';

export interface PointerFlags {
  meta: PointerMetaFlags;
  base: PointerBaseFlags;
  state: PointerStateFlags;
}

export interface PointerMetaFlags {
  isPrimary: boolean;
  isTouch: boolean;
  isMultiTouch?: boolean;
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
  isRightdown: boolean;
  isRightup: boolean;
  isRightmove: boolean;
  isLeftdown: boolean;
  isLeftup: boolean;
  isLeftmove: boolean;
  isMiddledown: boolean;
  isMiddleup: boolean;
  isMiddlemove: boolean;
  isBackdown: boolean;
  isBackup: boolean;
  isBackmove: boolean;
  isForwarddown: boolean;
  isForwardup: boolean;
  isForwardmove: boolean;
  isEraserdown: boolean;
  isEraserup: boolean;
  isErasermove: boolean;
}

export interface PointerValues {
  meta: PointerMetaValues;
  pressure: PointerPressureValues;
  tilt: Coord;
  twist: number;
  client: Coord;
  movement: Coord;
  touch: Coord; // a center coordinate of two clients
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

    return Object.assign({}, { meta }, { base }, { state });
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
    const movement: Coord = { x: $event.movementX, y: $event.movementY };

    return Object.assign(
      {},
      { meta },
      { pressure },
      { tilt },
      { twist },
      { client },
      { movement }
    );
  }

  private _generateMetaFlags($event: PointerEvent): PointerMetaFlags {
    const meta: PointerMetaFlags = {
      isPrimary: $event.isPrimary,
      isTouch: $event.pointerType === 'touch',
    };

    return meta;
  }

  private _generateBaseFlags($event: PointerEvent): PointerBaseFlags {
    const base = {} as PointerBaseFlags;

    switch ($event.type) {
      case POINTER.DOWN:
        base['down'] = true;
        break;

      case POINTER.UP:
        base['up'] = true;
        break;

      case POINTER.MOVE:
        base['move'] = true;
        break;

      case POINTER.OVER:
        base['over'] = true;
        break;

      case POINTER.ENTER:
        base['enter'] = true;
        break;

      case POINTER.CANCEL:
        base['cancel'] = true;
        break;

      case POINTER.OUT:
        base['out'] = true;
        break;

      case POINTER.LEAVE:
        base['leave'] = true;
        break;
    }

    return base;
  }

  private _generateStateFlags($event: PointerEvent): PointerStateFlags {
    let buttonType: string;
    const state = {} as PointerStateFlags;

    switch ($event.button) {
      case BUTTON_STATES.LEFT:
        buttonType = 'left';
        break;

      case BUTTON_STATES.MIDDLE:
        buttonType = 'middle';
        break;

      case BUTTON_STATES.RIGHT:
        buttonType = 'right';
        break;

      case BUTTON_STATES.BACK:
        buttonType = 'back';
        break;

      case BUTTON_STATES.FORWARD:
        buttonType = 'forward';
        break;

      case BUTTON_STATES.ERASER:
        buttonType = 'eraser';
        break;
    }

    if (buttonType)
      this._generateDownUpMoveFlags($event.type, buttonType, state);

    return state;
  }

  private _generateDownUpMoveFlags(
    $type: string,
    $buttonType: string,
    $flags: PointerStateFlags
  ): PointerStateFlags {
    if ($type === POINTER.DOWN) {
      $flags[`${$buttonType}down`] = true;
    } else if ($type === POINTER.UP) {
      $flags[`${$buttonType}up`] = true;
    } else if ($type === POINTER.MOVE) {
      $flags[`${$buttonType}move`] = true;
    }

    return $flags;
  }
}
