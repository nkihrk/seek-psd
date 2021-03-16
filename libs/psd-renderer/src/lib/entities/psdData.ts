import type { Psd, Layer } from 'ag-psd';
import { duplicateCanvasElement } from '@seek-psd/utils';

export interface IPsdData {
  readonly canvas: HTMLCanvasElement;
  readonly children: Layer[];
  readonly width: number;
  readonly height: number;
}

export interface IDummyPsdData {
  readonly canvas: HTMLImageElement;
  readonly children: IDummyLayer[];
  readonly width: number;
  readonly height: number;
}

export interface IDummyLayer {
  name: string;
  canvas: HTMLImageElement;
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
  canvas: HTMLImageElement;
  children: Layer[];
}

export class PsdData implements IPsdData {
  readonly canvas: HTMLCanvasElement;
  readonly children: Layer[] = [];
  readonly width: number;
  readonly height: number;

  constructor($fileName: string, $psd: Psd) {
    this.canvas = $psd.canvas;
    this.width = $psd.width;
    this.height = $psd.height;

    if ($psd.children.length > 0) {
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

export class DummyPsdData implements IDummyPsdData {
  readonly canvas: HTMLImageElement;
  readonly children: IDummyLayer[] = [];
  readonly width: number;
  readonly height: number;

  constructor($fileName: string, $psd: IDummyPsd) {
    this.canvas = $psd.canvas;
    this.width = $psd.width;
    this.height = $psd.height;

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
