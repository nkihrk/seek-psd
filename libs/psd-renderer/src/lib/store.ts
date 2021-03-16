import type { Layer } from 'ag-psd';
import type { ILayerInfo } from './entities/layerInfo';
import type { IPsdData, IDummyPsdData } from './entities/psdData';
import type { IPsd } from './entities/psd';

export interface IUserStore {
  psdSets: IPsdSet[];
  renderTargetSets: IRenderTargetSet[];
  psds: IPsd[];

  webGlElement: HTMLCanvasElement;
  shaders: IShaders;

  searchPsdByFilename($fileName: string): IPsd[];
  searchPsdByUniqueId($uniqueId: string): IPsd;
  searchRenderTargetByName($renderTargetName: string): HTMLCanvasElement;
}

export interface IPsdSet {
  fileName: string;
  psdData: IPsdData | IDummyPsdData;
}

export interface IRenderTargetSet {
  renderTargetName: string;
  renderTarget: HTMLCanvasElement;
}

export interface IShaders {
  vertex: IShaderSet[];
  fragment: IShaderSet[];
}

export interface IShaderSet {
  name: string;
  program: string;
}

export type TShaderType = SHADER_TYPE.VERTEX | SHADER_TYPE.FRAGMENT;

export enum SHADER_TYPE {
  VERTEX = 'vertex',
  FRAGMENT = 'fragmentr',
}

export class Store implements IUserStore {
  renderTargetSets: IRenderTargetSet[] = [];
  psdSets: IPsdSet[] = [];
  psds: IPsd[] = [];

  webGlElement = null;
  shaders = {
    vertex: [],
    fragment: [],
  };

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

  searchShaderByType($shaderType: TShaderType): IShaderSet[] {
    return this.shaders[$shaderType];
  }

  searchShaderByName(
    $shaderType: TShaderType,
    $shaderName: string
  ): IShaderSet {
    return this.shaders[$shaderType].filter((e) => e.name === $shaderName);
  }
}
