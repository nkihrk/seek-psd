import type { Layer } from 'ag-psd';
import type { IRenderTargetSet } from './psdRenderer';
import type { ILayerInfo } from './entities/layerInfo';
import type { IPsdData } from './entities/psdData';
import type { IPsd } from './entities/psd';

export interface IUserStore {
  psdSets: IPsdSet[];
  renderTargetSets: IRenderTargetSet[];
  psds: IPsd[];

  searchPsdByFilename($fileName: string): IPsd[];
  searchPsdByUniqueId($uniqueId: string): IPsd;
  getRawPsdCanvas: ($psd: IPsd) => HTMLCanvasElement;
}

export interface IPsdSet {
  fileName: string;
  psdData: IPsdData;
}

export class Store implements IUserStore {
  renderTargetSets: IRenderTargetSet[] = [];
  psdSets: IPsdSet[] = [];
  psds: IPsd[] = [];

  constructor() {}

  searchPsdByFilename($fileName: string): IPsd[] {
    const psds: IPsd[] = this.psds.filter((e) => e.fileName === $fileName);

    return psds;
  }

  searchPsdByUniqueId($uniqueId: string): IPsd {
    const psd: IPsd = this.psds.filter((e) => e.uniqueId === $uniqueId)[0];

    return psd;
  }

  getRawPsdCanvas($psd: IPsd): HTMLCanvasElement {
    const psd: IPsd = $psd;

    return null;
  }
}
