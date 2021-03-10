import type { Psd } from 'ag-psd';

export interface IUserStore {
  psdData: PsdData;
}

export interface PsdData {
  fileName: string;
  psd: Psd;
}

export class Store implements IUserStore {
  psdData = {} as PsdData;

  constructor() {}
}
