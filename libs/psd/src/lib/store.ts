import type { Psd } from 'ag-psd';

export interface IUserStore {
  psdData: IPsdData;
}

export interface IPsdData {
  fileName: string;
  psd: Psd;
}

export class Store implements IUserStore {
  psdData = null;

  constructor() {}
}
