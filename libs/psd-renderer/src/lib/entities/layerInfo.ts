import { generateUuid } from '@seek-psd/utils';
import type { Layer, Psd } from 'ag-psd';

export interface ILayerInfo {
  readonly layerName: string;
  readonly uniqueId: string;
  readonly element: HTMLCanvasElement;
  readonly layer: ILayer;
  isLayerHidden: IIsLayerHidden;
  folderThumbnail: HTMLCanvasElement;
  children: ILayerInfo[];
}

export interface ILayer {
  blendMode: string;
  opacity: number;
  clipping: boolean;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface IIsLayerHidden {
  current: boolean;
  prev: boolean;
  parent: boolean;
}

export class LayerInfo implements ILayerInfo {
  readonly layerName: string;
  readonly uniqueId: string;
  readonly element: HTMLCanvasElement;
  readonly layer: ILayer;
  readonly isFolder: boolean;
  folderThumbnail: HTMLCanvasElement = null;
  isLayerHidden: IIsLayerHidden = {
    current: false,
    prev: true,
    parent: false,
  };
  children: ILayerInfo[] = [];

  constructor($layer: Layer, $isLayerHidden?: IIsLayerHidden) {
    this.layerName = $layer.name;
    this.uniqueId = generateUuid();
    this.element = $layer.canvas || null;
    this.layer = {
      blendMode: $layer.blendMode,
      opacity: $layer.opacity,
      clipping: $layer.clipping,
      left: $layer.left,
      right: $layer.right,
      top: $layer.top,
      bottom: $layer.bottom,
    };
    this.isFolder =
      $layer.children?.length > 0 &&
      !($layer.canvas instanceof HTMLCanvasElement);

    if ($isLayerHidden) this.isLayerHidden = $isLayerHidden;
  }
}
