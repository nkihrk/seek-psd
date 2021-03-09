import type { Entity } from './entities/entity';
import type { IClipboardFlags } from './events/meta-filters/clipboardMetaFilter';
import type {
  IPointerFlags,
  Coord,
} from './events/meta-filters/pointerMetaFilter';
import type {
  IKeyboardFlags,
  IKeyboardValues,
} from './events/meta-filters/keyboardMetaFilter';
import type { IDragFlags } from './events/meta-filters/dragMetaFilter';
import type {
  IEventFlags,
  IEventValues,
} from './events/meta-filters/eventMetaFilter';
import type {
  IMouseFlags,
  IMouseValues,
} from './events/meta-filters/mouseMetaFilter';
import type {
  IWheelFlags,
  IWheelValues,
} from './events/meta-filters/wheelMetaFilter';

export interface IStore {
  entity: Entity;
  notifyType: string;
  defaultEvent: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  flags: IFlags;
  values: IValues;
}

export interface IFlags {
  clipboard: IClipboardFlags;
  pointer: IPointerFlags;
  keyboard: IKeyboardFlags;
  drag: IDragFlags;
  event: IEventFlags;
  mouse: IMouseFlags;
  wheel: IWheelFlags;
}

export interface IValues {
  clipboard: IFiles;
  pointer: IPointerOffset;
  keyboard: IKeyboardValues;
  drag: IFiles;
  event: IEventValues;
  mouse: IMouseValues;
  wheel: IWheelValues;
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

export class Store {
  entity: Entity = null;

  notifyType = '';

  // System defined event goes here
  // e.g. PointerEvent, ClipboardEvent, etc..
  defaultEvent = null;

  flags: IFlags = {
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

  values: IValues = {
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
}
