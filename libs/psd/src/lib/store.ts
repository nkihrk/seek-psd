import type { Psd } from 'ag-psd';

export interface IPsdData {
  fileName: string;
  psd: Psd;
}

export class Store {
  private _psdData = {} as IPsdData;

  constructor() {}

  get psdData(): IPsdData {
    return this._psdData;
  }
}
