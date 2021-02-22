import { MetaFilter } from './metaFilter';
import { KEY_LOCATION } from '../../constants/index';

export interface KeyboardFlags {
  isAltKey: boolean;
  isCtrlKey: boolean;
  isMetaKey: boolean;
  isShiftKey: boolean;
  isRepeat: boolean;
  isKeydown: boolean;
  isKeyup: boolean;
}

export interface KeyboardValues {
  location: string;
  key: string;
}

export class KeyboardMetaFilter extends MetaFilter<
  KeyboardFlags,
  KeyboardValues
> {
  constructor() {
    super();
  }

  protected generateFlags($event: KeyboardEvent): KeyboardFlags {
    const flags: KeyboardFlags = {
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

  protected generateValues($event: KeyboardEvent): KeyboardValues {
    const values: KeyboardValues = {
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
