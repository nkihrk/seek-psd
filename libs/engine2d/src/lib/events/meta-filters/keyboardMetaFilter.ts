import { MetaFilter } from './metaFilter';
import { KEY_LOCATION } from '../../constants/index';

export interface IKeyboardFlags {
  isAltKey: boolean;
  isCtrlKey: boolean;
  isMetaKey: boolean;
  isShiftKey: boolean;
  isRepeat: boolean;
  isKeydown: boolean;
  isKeyup: boolean;
}

export interface IKeyboardValues {
  location: string;
  key: string;
}

export class KeyboardMetaFilter extends MetaFilter<
  IKeyboardFlags,
  IKeyboardValues
> {
  constructor() {
    super();
  }

  protected generateFlags($event: KeyboardEvent): IKeyboardFlags {
    const flags: IKeyboardFlags = {
      isAltKey: $event.altKey,
      isCtrlKey: $event.ctrlKey,
      isMetaKey: $event.metaKey,
      isShiftKey: $event.shiftKey,
      isRepeat: $event.repeat,
      isKeydown: false, // will be changed at onKeyboardEvent
      isKeyup: false, // will be changed at onKeyboardEvent
    };

    return flags;
  }

  protected generateValues($event: KeyboardEvent): IKeyboardValues {
    const values: IKeyboardValues = {
      key: $event.key,
      location: this._getLocation($event.location),
    };

    return values;
  }

  private _getLocation($location: number): string {
    let location = '';

    switch ($location) {
      case 0x00:
        location = KEY_LOCATION.STANDARD;
        break;

      case 0x01:
        location = KEY_LOCATION.LEFT;
        break;

      case 0x02:
        location = KEY_LOCATION.RIGHT;
        break;

      case 0x03:
        location = KEY_LOCATION.NUMPAD;
        break;
    }

    return location;
  }
}
