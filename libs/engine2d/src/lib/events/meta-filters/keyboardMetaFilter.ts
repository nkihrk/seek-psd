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
      case KEY_LOCATION.STANDARD:
        location = 'standard';
        break;

      case KEY_LOCATION.LEFT:
        location = 'left';
        break;

      case KEY_LOCATION.RIGHT:
        location = 'right';
        break;

      case KEY_LOCATION.NUMPAD:
        location = 'numpad';
        break;
    }

    return location;
  }
}
