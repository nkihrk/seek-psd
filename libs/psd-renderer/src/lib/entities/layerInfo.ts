import { generateUuid } from '@seek-psd/utils';
import type { Layer, Psd } from 'ag-psd';

export interface ILayerInfo {
  readonly layerName: string;
  readonly uniqueId: string;
  readonly layer: Layer | Psd;
  isLayerHidden: IIsLayerHidden;
  folderCanvas: HTMLCanvasElement;
  children: ILayerInfo[];
}

export interface IIsLayerHidden {
  current: boolean;
  prev: boolean;
  parent: boolean;
}

export class LayerInfo implements ILayerInfo {
  readonly layerName: string;
  readonly uniqueId: string;
  readonly layer: Layer | Psd;
  folderCanvas: HTMLCanvasElement = null;
  isLayerHidden: IIsLayerHidden = {
    current: false,
    prev: true,
    parent: false,
  };
  children: ILayerInfo[] = [];

  constructor($layer: Layer | Psd, $isLayerHidden?: IIsLayerHidden) {
    this.layerName = $layer.name;
    this.uniqueId = generateUuid();
    this.layer = $layer;
    if ($isLayerHidden) this.isLayerHidden = $isLayerHidden;
  }
}
