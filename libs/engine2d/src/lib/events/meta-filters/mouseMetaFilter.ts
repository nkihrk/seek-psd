import { MetaFilter } from './metaFilter';
import { getButtonValue, getButtonsValue } from './utils/index';

export interface IMouseFlags {
  isAltKey: boolean;
  isCtrlKey: boolean;
  isMetaKey: boolean;
  isShiftKey: boolean;
  isClick: boolean;
  isDblClick: boolean;
  isContextmenu: boolean;
}

export interface IMouseValues {
  button: string;
  buttons: string[];
}

export class MouseMetaFilter extends MetaFilter<IMouseFlags, IMouseValues> {
  constructor() {
    super();
  }

  protected generateFlags($event: MouseEvent): IMouseFlags {
    const flags: IMouseFlags = {
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

  protected generateValues($event: MouseEvent): IMouseValues {
    const values: IMouseValues = {
      button: getButtonValue($event.button),
      buttons: getButtonsValue($event.buttons),
    };

    return values;
  }
}
