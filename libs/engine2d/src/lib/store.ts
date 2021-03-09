import type { Entity } from './entities/entity';
import type { ClipboardFlags } from './events/meta-filters/clipboardMetaFilter';
import type {
  PointerFlags,
  Coord,
} from './events/meta-filters/pointerMetaFilter';
import type {
  KeyboardFlags,
  KeyboardValues,
} from './events/meta-filters/keyboardMetaFilter';
import type { DragFlags } from './events/meta-filters/dragMetaFilter';
import type {
  EventFlags,
  EventValues,
} from './events/meta-filters/eventMetaFilter';
import type {
  MouseFlags,
  MouseValues,
} from './events/meta-filters/mouseMetaFilter';
import type {
  WheelFlags,
  WheelValues,
} from './events/meta-filters/wheelMetaFilter';

export interface IStore {
  entity: Entity;
  notifyType: string;
  defaultEvent: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  flags: IFlags;
  values: IValues;
}

export interface IFlags {
  clipboard: ClipboardFlags;
  pointer: PointerFlags;
  keyboard: KeyboardFlags;
  drag: DragFlags;
  event: EventFlags;
  mouse: MouseFlags;
  wheel: WheelFlags;
}

export interface IValues {
  clipboard: IFiles;
  pointer: IPointerOffset;
  keyboard: KeyboardValues;
  drag: IFiles;
  event: EventValues;
  mouse: MouseValues;
  wheel: WheelValues;
}

export interface IPointerOffset {
  current: Coord;
  prev: Coord;
  raw: Coord;
  tmp: Coord;
}

export interface IFiles {
  data: DataTransfer;
  files: File[];
}

export abstract class Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected static _userStore: any = null;

  protected _entity: Entity = null;

  protected _notifyType = '';

  // System defined event goes here
  // e.g. PointerEvent, ClipboardEvent, etc..
  protected _defaultEvent = null;

  protected _flags: IFlags = {
    clipboard: {
      isCopy: false,
      isCut: false,
      isPaste: false,
    },
    pointer: {
      base: {
        isCancel: false,
        isDown: false,
        isEnter: false,
        isLeave: false,
        isMove: false,
        isOut: false,
        isOver: false,
        isUp: false,
      },
      meta: {
        isShiftKey: false,
        isMetaKey: false,
        isCtrlKey: false,
        isAltKey: false,
        isMultiTouch: false,
        isPrimary: false,
        isTouch: false,
      },
      state: {
        isBackDown: false,
        isBackMove: false,
        isBackUp: false,
        isEraserDown: false,
        isEraserMove: false,
        isEraserUp: false,
        isForwardDown: false,
        isForwardMove: false,
        isForwardUp: false,
        isLeftDown: false,
        isLeftMove: false,
        isLeftUp: false,
        isMiddleDown: false,
        isMiddleMove: false,
        isMiddleUp: false,
        isRightDown: false,
        isRightMove: false,
        isRightUp: false,
      },
    },
    keyboard: {
      isAltKey: false,
      isCtrlKey: false,
      isKeydown: false,
      isKeyup: false,
      isMetaKey: false,
      isRepeat: false,
      isShiftKey: false,
    },
    drag: {
      isDrag: false,
      isDragEnd: false,
      isDragEnter: false,
      isDragLeave: false,
      isDragOver: false,
      isDragStart: false,
      isDrop: false,
    },
    event: {
      isFullscreen: false,
      isFullscreenSupported: false,
      isOnline: false,
    },
    mouse: {
      isAltKey: false,
      isCtrlKey: false,
      isMetaKey: false,
      isShiftKey: false,
      isClick: false,
      isContextmenu: false,
      isDblClick: false,
    },
    wheel: {
      isWheelStart: false,
    },
  };

  protected _values: IValues = {
    clipboard: {
      data: null,
      files: [],
    },
    pointer: {
      current: {
        x: -Infinity,
        y: -Infinity,
      },
      prev: {
        x: -Infinity,
        y: -Infinity,
      },
      raw: {
        x: -Infinity,
        y: -Infinity,
      },
      tmp: {
        x: -Infinity,
        y: -Infinity,
      },
    },
    keyboard: {
      key: '',
      location: '',
    },
    drag: {
      data: null,
      files: [],
    },
    event: {},
    mouse: {
      button: '',
      buttons: [],
    },
    wheel: {
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
    },
  };

  constructor() {}

  get store(): IStore {
    return {
      entity: this.entity,
      notifyType: this.notifyType,
      defaultEvent: this.defaultEvent,
      flags: this.flags,
      values: this.values,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get userStore(): any {
    return Store._userStore;
  }

  get entity(): Entity {
    return this._entity;
  }

  get notifyType(): string {
    return this._notifyType;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get defaultEvent(): any {
    return this._defaultEvent;
  }

  get flags(): IFlags {
    return this._flags;
  }

  get values(): IValues {
    return this._values;
  }
}
