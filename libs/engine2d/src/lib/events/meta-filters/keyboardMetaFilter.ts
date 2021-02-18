import { MetaFilter } from './metaFilter';
import { KEY_LOCATION } from '../../constants/index';

export interface KeyboardFlags {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  repeat: boolean;
  keydown: boolean;
  keyup: boolean;
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
      altKey: $event.altKey,
      ctrlKey: $event.ctrlKey,
      metaKey: $event.metaKey,
      shiftKey: $event.shiftKey,
      repeat: $event.repeat,
      keydown: false, // will be changed at onKeyboardEvent
      keyup: false, // will be changed at onKeyboardEvent
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
