import type { Entity } from './entities/entity';
import type {
  ClipboardFlags,
  ClipboardValues,
} from './events/meta-filters/clipboardMetaFilter';
import type {
  PointerFlags,
  Coord,
} from './events/meta-filters/pointerMetaFilter';
import type {
  KeyboardFlags,
  KeyboardValues,
} from './events/meta-filters/keyboardMetaFilter';
import type {
  DragFlags,
  DragValues,
} from './events/meta-filters/dragMetaFilter';
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

export interface PointerOffset {
  current: Coord;
  prev: Coord;
  raw: Coord;
  tmp: Coord;
}

export abstract class Store {
  protected _notifyType = '';

  protected _entity: Entity = null;

  protected _clipboardFlags: ClipboardFlags = {
    isCopy: false,
    isCut: false,
    isPaste: false,
  };

  protected _clipboardValues: ClipboardValues = {
    data: null,
  };

  protected _keyboardFlags: KeyboardFlags = {
    isAltKey: false,
    isCtrlKey: false,
    isKeydown: false,
    isKeyup: false,
    isMetaKey: false,
    isRepeat: false,
    isShiftKey: false,
  };

  protected _keyboardValues: KeyboardValues = {
    key: '',
    location: '',
  };

  protected _pointerOffset: PointerOffset = {
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
  };

  protected _pointerFlags: PointerFlags = {
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
  };

  protected _dragFlags: DragFlags = {
    isDrag: false,
    isDragEnd: false,
    isDragEnter: false,
    isDragLeave: false,
    isDragOver: false,
    isDragStart: false,
    isDrop: false,
  };

  protected _dragValues: DragValues = {
    data: null,
  };

  protected _eventFlags: EventFlags = {
    isFullscreen: false,
    isFullscreenSupported: false,
    isOnline: false,
  };

  protected _eventValues: EventValues = {};

  protected _mouseFlags: MouseFlags = {
    isAltKey: false,
    isCtrlKey: false,
    isMetaKey: false,
    isShiftKey: false,
    isClick: false,
    isContextmenu: false,
    isDblClick: false,
  };

  protected _mouseValues: MouseValues = {
    button: '',
    buttons: [],
  };

  protected _wheelFlags: WheelFlags = {
    isWheelStart: false,
  };

  protected _wheelValues: WheelValues = {
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
  };

  constructor() {}

  get notifyType(): string {
    return this._notifyType;
  }

  get entity(): Entity {
    return this._entity;
  }

  get clipboardFlags(): ClipboardFlags {
    return this._clipboardFlags;
  }

  get clipboardValues(): ClipboardValues {
    return this._clipboardValues;
  }

  get keyboardFlags(): KeyboardFlags {
    return this._keyboardFlags;
  }

  get keyboardValues(): KeyboardValues {
    return this._keyboardValues;
  }

  get pointerOffset(): PointerOffset {
    return this._pointerOffset;
  }

  get pointerFlags(): PointerFlags {
    return this._pointerFlags;
  }

  get dragFlags(): DragFlags {
    return this._dragFlags;
  }

  get dragValues(): DragValues {
    return this._dragValues;
  }

  get eventFlags(): EventFlags {
    return this._eventFlags;
  }

  get eventValues(): EventValues {
    return this._eventValues;
  }

  get mouseFlags(): MouseFlags {
    return this._mouseFlags;
  }

  get mouseValues(): MouseValues {
    return this._mouseValues;
  }

  get wheelFlags(): WheelFlags {
    return this._wheelFlags;
  }

  get wheelValues(): WheelValues {
    return this._wheelValues;
  }
}
