import type { Psd, Layer } from 'ag-psd';

export interface IPsdData {
  readonly canvas: HTMLCanvasElement;
  readonly children: IPsdDataChild[] | Layer[];
  width: number;
  height: number;
}

export interface IPsdDataChild {
  name: string;
  canvas: HTMLCanvasElement;
  blendMode: string;
  hidden: boolean;
  opacity: number;
  clipping: boolean;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface IDummyPsd {
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  children: Layer[];
}

export class PsdData implements IPsdData {
  readonly canvas: HTMLCanvasElement;
  readonly children: IPsdDataChild[] | Layer[] = [];
  width = 0;
  height = 0;

  constructor($fileName: string, $psd: Psd | IDummyPsd) {
    this.canvas = $psd.canvas;
    this.width = $psd.width;
    this.height = $psd.height;

    if ($psd.children) {
      this.children = $psd.children;
    } else {
      this.children.push({
        name: $fileName,
        canvas: $psd.canvas,
        blendMode: 'normal',
        hidden: false,
        opacity: 1,
        clipping: false,
        left: 0,
        right: $psd.width,
        top: 0,
        bottom: $psd.height,
      });
    }
  }
}
