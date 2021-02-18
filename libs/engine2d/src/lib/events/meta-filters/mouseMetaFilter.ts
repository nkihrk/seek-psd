import { MetaFilter } from './metaFilter';
import { BUTTON_STATES, BUTTONS_STATES } from '../../constants/index';

export interface MouseFlags {
  isAltKey: boolean;
  isCtrlKey: boolean;
  isMetaKey: boolean;
  isShiftKey: boolean;
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
    };

    return flags;
  }

  protected generateValues($event: MouseEvent): MouseValues {
    const values: MouseValues = {
      button: this._getButtonValue($event.button),
      buttons: this._getButtonsValue($event.buttons),
    };

    return values;
  }

  private _getButtonValue($buttonType: number): string {
    let buttonType: string;

    switch ($buttonType) {
      case BUTTON_STATES.LEFT:
        buttonType = 'left';
        break;

      case BUTTON_STATES.MIDDLE:
        buttonType = 'middle';
        break;

      case BUTTON_STATES.RIGHT:
        buttonType = 'right';
        break;

      case BUTTON_STATES.BACK:
        buttonType = 'back';
        break;

      case BUTTON_STATES.FORWARD:
        buttonType = 'forward';
        break;
    }

    return buttonType;
  }

  private _getButtonsValue($buttonType: number): string[] {
    let buttonsType: string[] = [];

    switch ($buttonType) {
      case BUTTONS_STATES.LEFT_RIGHT:
        buttonsType = ['left', 'right'];
        break;

      case BUTTONS_STATES.LEFT_MIDDLE:
        buttonsType = ['left', 'middle'];
        break;

      case BUTTONS_STATES.LEFT_BACK:
        buttonsType = ['left', 'back'];
        break;

      case BUTTONS_STATES.LEFT_FORWARD:
        buttonsType = ['left', 'forward'];
        break;

      case BUTTONS_STATES.RIGHT_MIDDLE:
        buttonsType = ['right', 'middle'];
        break;

      case BUTTONS_STATES.RIGHT_BACK:
        buttonsType = ['right', 'back'];
        break;

      case BUTTONS_STATES.RIGHT_FORWARD:
        buttonsType = ['right', 'forward'];
        break;

      case BUTTONS_STATES.MIDDLE_BACK:
        buttonsType = ['middle', 'back'];
        break;

      case BUTTONS_STATES.MIDDLE_FORWARD:
        buttonsType = ['middle', 'forward'];
        break;

      case BUTTONS_STATES.BACK_FORWARD:
        buttonsType = ['back', 'forward'];
        break;
    }

    return buttonsType;
  }
}
