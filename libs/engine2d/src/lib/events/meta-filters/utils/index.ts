import {
  BUTTON_STATES,
  BUTTONS_STATES,
  BUTTON_NAME,
} from '../../../constants/index';

export function getButtonValue($buttonType: number): string {
  let buttonType: string;

  switch ($buttonType) {
    case BUTTON_STATES.LEFT:
      buttonType = BUTTON_NAME.LEFT;
      break;

    case BUTTON_STATES.MIDDLE:
      buttonType = BUTTON_NAME.MIDDLE;
      break;

    case BUTTON_STATES.RIGHT:
      buttonType = BUTTON_NAME.RIGHT;
      break;

    case BUTTON_STATES.BACK:
      buttonType = BUTTON_NAME.BACK;
      break;

    case BUTTON_STATES.FORWARD:
      buttonType = BUTTON_NAME.FORWARD;
      break;
  }

  return buttonType || null;
}

export function getButtonsValue($buttonsType: number): string[] {
  let buttonsType: string[] = [];

  switch ($buttonsType) {
    case BUTTONS_STATES.LEFT_RIGHT:
      buttonsType = [BUTTON_NAME.LEFT, BUTTON_NAME.RIGHT];
      break;

    case BUTTONS_STATES.LEFT_MIDDLE:
      buttonsType = [BUTTON_NAME.LEFT, BUTTON_NAME.MIDDLE];
      break;

    case BUTTONS_STATES.LEFT_BACK:
      buttonsType = [BUTTON_NAME.LEFT, BUTTON_NAME.BACK];
      break;

    case BUTTONS_STATES.LEFT_FORWARD:
      buttonsType = [BUTTON_NAME.LEFT, BUTTON_NAME.FORWARD];
      break;

    case BUTTONS_STATES.RIGHT_MIDDLE:
      buttonsType = [BUTTON_NAME.RIGHT, BUTTON_NAME.MIDDLE];
      break;

    case BUTTONS_STATES.RIGHT_BACK:
      buttonsType = [BUTTON_NAME.RIGHT, BUTTON_NAME.BACK];
      break;

    case BUTTONS_STATES.RIGHT_FORWARD:
      buttonsType = [BUTTON_NAME.RIGHT, BUTTON_NAME.FORWARD];
      break;

    case BUTTONS_STATES.MIDDLE_BACK:
      buttonsType = [BUTTON_NAME.MIDDLE, BUTTON_NAME.BACK];
      break;

    case BUTTONS_STATES.MIDDLE_FORWARD:
      buttonsType = [BUTTON_NAME.MIDDLE, BUTTON_NAME.FORWARD];
      break;

    case BUTTONS_STATES.BACK_FORWARD:
      buttonsType = [BUTTON_NAME.BACK, BUTTON_NAME.FORWARD];
      break;
  }

  return buttonsType;
}
