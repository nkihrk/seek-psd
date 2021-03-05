import type { Psd } from 'ag-psd';

export interface PsdData {
  fileName: string;
  psd: Psd;
}

export class Store {
  private _psdData = {} as PsdData;

  constructor() {}

  get psdData(): PsdData {
    return this._psdData;
  }
}
