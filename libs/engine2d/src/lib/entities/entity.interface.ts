export interface Entity {}

export interface CanvasEntity extends Entity {
  readonly element: HTMLCanvasElement;
}

export interface ElementEntity extends Entity {}

export interface FileEntity extends Entity {}

export interface StringEntity extends Entity {}
