import { MetaFilter } from './metaFilter';
import { BUTTON_STATES, POINTER } from '../../constants/index';

export interface PointerFlags {
  base: PointerBaseFlags;
  state: PointerStateFlags;
}

export interface PointerBaseFlags {
  down: boolean;
  up: boolean;
  move: boolean;
  over: boolean;
  enter: boolean;
  cancel: boolean;
  out: boolean;
  leave: boolean;
}

export interface PointerStateFlags {
  rightdown: boolean;
  rightup: boolean;
  rightmove: boolean;
  leftdown: boolean;
  leftup: boolean;
  leftmove: boolean;
  middledown: boolean;
  middleup: boolean;
  middlemove: boolean;
  backdown: boolean;
  backup: boolean;
  backmove: boolean;
  forwarddown: boolean;
  forwardup: boolean;
  forwardmove: boolean;
  eraserdown: boolean;
  eraserup: boolean;
  erasermove: boolean;
}

export interface PointerValues {
  meta: PointerMetaValues;
  pressure: PointerPressureValues;
  tilt: Coord;
  twist: number;
  coord: PointerCoordValues;
}

export interface Coord {
  x: number;
  y: number;
}

export interface PointerMetaValues {
  id: number;
  type: string;
  isPrimary: boolean;
}

export interface PointerPressureValues {
  normal: number;
  tangential: number;
}

export interface PointerCoordValues {
  client: Coord;
  movement: Coord;
}

export class PointerMetaFilter extends MetaFilter {
  private _flags = {} as PointerFlags;
  private _values = {} as PointerValues;

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
    const base: PointerBaseFlags = this._generateBaseFlags($event);
    const state: PointerStateFlags = this._generateStateFlags($event);

    return Object.assign({}, { base }, { state });
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
    const state = {} as PointerStateFlags;

    switch ($event.button) {
      case BUTTON_STATES.LEFT:
        this._generateDownUpMoveFlags($event.type, 'left', state);
        break;

      case BUTTON_STATES.MIDDLE:
        this._generateDownUpMoveFlags($event.type, 'middle', state);
        break;

      case BUTTON_STATES.RIGHT:
        this._generateDownUpMoveFlags($event.type, 'right', state);
        break;

      case BUTTON_STATES.BACK:
        this._generateDownUpMoveFlags($event.type, 'back', state);
        break;

      case BUTTON_STATES.FORWARD:
        this._generateDownUpMoveFlags($event.type, 'forward', state);
        break;

      case BUTTON_STATES.ERASER:
        this._generateDownUpMoveFlags($event.type, 'eraser', state);
        break;
    }

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

  private _generateValues($event: PointerEvent): PointerValues {
    const meta: PointerMetaValues = {
      id: $event.pointerId,
      type: $event.pointerType,
      isPrimary: $event.isPrimary,
    };
    const pressure: PointerPressureValues = {
      normal: $event.pressure,
      tangential: $event.tangentialPressure,
    };
    const tilt: Coord = { x: $event.clientX, y: $event.clientY };
    const twist: number = $event.twist;

    return Object.assign({}, { meta }, { pressure }, { tilt }, { twist });
  }
}
