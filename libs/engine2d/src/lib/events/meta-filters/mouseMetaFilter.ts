import { MetaFilter } from './metaFilter';
import { getButtonValue, getButtonsValue } from './utils/index';

export interface MouseFlags {
  isAltKey: boolean;
  isCtrlKey: boolean;
  isMetaKey: boolean;
  isShiftKey: boolean;
  isClick: boolean;
  isDblClick: boolean;
  isContextmenu: boolean;
}

export interface MouseValues {
  button: string;
  buttons: string[];
}

export class MouseMetaFilter extends MetaFilter<MouseFlags, MouseValues> {
  constructor() {
    super();
  }

  protected generateFlags($event: MouseEvent): MouseFlags {
    const flags: MouseFlags = {
      isAltKey: $event.altKey,
      isCtrlKey: $event.ctrlKey,
      isMetaKey: $event.metaKey,
      isShiftKey: $event.shiftKey,
      isClick: false, // will be changed at onMouseEvent
      isDblClick: false, // will be changed at onMouseEvent
      isContextmenu: false, // will be changed at onMouseEvent
    };

    return flags;
  }

  protected generateValues($event: MouseEvent): MouseValues {
    const values: MouseValues = {
      button: getButtonValue($event.button),
      buttons: getButtonsValue($event.buttons),
    };

    return values;
  }
}
