import type { Layer } from 'ag-psd';
import type { ILayerInfo } from './entities/layerInfo';
import type { IPsdData } from './entities/psdData';
import type { IPsd } from './entities/psd';

export interface IUserStore {
  psdSets: IPsdSet[];
  renderTargetSets: IRenderTargetSet[];
  psds: IPsd[];

  webGlElement: HTMLCanvasElement;

  searchPsdByFilename($fileName: string): IPsd[];
  searchPsdByUniqueId($uniqueId: string): IPsd;
  searchRenderTargetByName($renderTargetName: string): HTMLCanvasElement;
}

export interface IPsdSet {
  fileName: string;
  psdData: IPsdData;
}

export interface IRenderTargetSet {
  renderTargetName: string;
  renderTarget: HTMLCanvasElement;
}

export class Store implements IUserStore {
  renderTargetSets: IRenderTargetSet[] = [];
  psdSets: IPsdSet[] = [];
  psds: IPsd[] = [];

  webGlElement = null;

  constructor() {}

  searchPsdByFilename($fileName: string): IPsd[] {
    const psds: IPsd[] = this.psds.filter((e) => e.fileName === $fileName);

    return psds;
  }

  searchPsdByUniqueId($uniqueId: string): IPsd {
    const psd: IPsd = this.psds.filter((e) => e.uniqueId === $uniqueId)[0];

    return psd;
  }

  searchRenderTargetByName($renderTargetName: string): HTMLCanvasElement {
    const renderTarget: HTMLCanvasElement = this.renderTargetSets.filter(
      (e) => e.renderTargetName === $renderTargetName
    )[0].renderTarget;

    return renderTarget;
  }
}
