// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events#determining_button_states
export enum BUTTON_STATES {
  NO_CHANGE = -1, // Neither buttons nor touch/pen contact changed since last event
  LEFT = 0, // Left Mouse, Touch Contact, Pen contact
  MIDDLE = 1, // Middle Mouse
  RIGHT = 2, // Right Mouse, Pen barrel button
  BACK = 3, // X1 (back) Mouse
  FORWARD = 4, // X2 (forward) Mouse
  ERASER = 5, // Pen eraser button
}
export enum BUTTONS_STATES {
  NO_BUTTON = 0,
  LEFT_RIGHT = 3,
  LEFT_MIDDLE = 5,
  LEFT_BACK = 7,
  LEFT_FORWARD = 17,
  RIGHT_MIDDLE = 6,
  RIGHT_BACK = 10,
  RIGHT_FORWARD = 18,
  MIDDLE_BACK = 12,
  MIDDLE_FORWARD = 20,
  BACK_FORWARD = 24,
}
export enum BUTTON_NAME {
  LEFT = 'left',
  MIDDLE = 'middle',
  RIGHT = 'right',
  BACK = 'back',
  FORWARD = 'forward',
  ERASER = 'eraser',
}
export enum POINTER {
  DOWN = 'pointerdown',
  UP = 'pointerup',
  MOVE = 'pointermove',
  OVER = 'pointerover',
  ENTER = 'pointerenter',
  CANCEL = 'pointercancel',
  OUT = 'pointerout',
  LEAVE = 'pointerleave',
}
export enum KEY_LOCATION {
  STANDARD = 'standard',
  LEFT = 'left',
  RIGHT = 'right',
  NUMPAD = 'numpad',
}
export enum NOTIFY_TYPE {
  GLOBAL = 'global',
  TARGET = 'target',
}
export enum EVENT_TYPE {
  CLIPBOARD = 'clipboard',
  KEYBOARD = 'keyboard',
  POINTER = 'pointer',
  DRAG = 'drag',
  EVENT = 'event',
  MOUSE = 'mouse',
  WHEEL = 'wheel',
  RENDER = 'render',
  ANY = 'any',
}

export const POINTER_EVENT = [
  'pointerdown',
  'pointerup',
  'pointermove',
  'pointerover',
  'pointerenter',
  'pointercancel',
  'pointerout',
  'pointerleave',
];
export const WHEEL_EVENT = ['wheel'];
export const CLICK_EVENT = ['click', 'dblclick'];
export const CONTEXTMENU_EVENT = ['contextmenu'];
export const VIEW_EVENT = ['fullscreenchange, fullscreenerror'];
export const NETWORK_EVENT = ['online', 'offline'];
export const DRAG_EVENT = [
  'drag',
  'dragend',
  'dragenter',
  'dragstart',
  'dragleave',
  'dragover',
  'drop',
];
export const CLIPBOARD_EVENT = ['cut', 'copy', 'paste'];
export const KEYBOARD_EVENT = ['keydown', 'keyup', 'keypress'];
export const WHEEL_INTERVAL = 500;
export const IDLE_INTERVAL = 1;
