export class Entity {
  readonly element: HTMLElement;

  constructor($element: HTMLElement) {
    this.element = $element;

    if (!$element) throw new Error('element is not set properly');
  }
}
