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
