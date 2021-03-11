import type { Layer } from 'ag-psd';
import type { IRenderTargetSet } from './psdRenderer';
import type { ILayerInfo } from './entities/layerInfo';
import type { IPsdData } from './entities/psdData';

export interface IUserStore {
  psdSets: IPsdSet[];
  renderTargetSets: IRenderTargetSet[];
  layerInfos: ILayerInfo[];
}

export interface IPsdSet {
  fileName: string;
  psdData: IPsdData;
}

export class Store implements IUserStore {
  renderTargetSets: IRenderTargetSet[] = [];
  psdSets: IPsdSet[] = [];
  layerInfos: ILayerInfo[] = [];

  constructor() {}
}
