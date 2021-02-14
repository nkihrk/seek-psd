import { CanvasEntity } from './entity.interface';

export class Canvas implements CanvasEntity {
  readonly element: HTMLCanvasElement;

  constructor($element: HTMLCanvasElement) {
    this.element = $element;
  }
}
