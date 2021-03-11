import type { Psd } from 'ag-psd';

export interface IUserStore {
  psdDatas: PsdData[];
}

export interface PsdData {
  fileName: string;
  psd: Psd;
}

export class Store implements IUserStore {
  psdDatas = [];

  constructor() {}
}
