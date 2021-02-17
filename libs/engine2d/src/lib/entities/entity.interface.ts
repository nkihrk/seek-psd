export interface Entity {
  readonly element: HTMLElement;
}

export interface CanvasEntity extends Entity {}

export interface ElementEntity extends Entity {}

export interface FileEntity extends Entity {}

export interface StringEntity extends Entity {}
