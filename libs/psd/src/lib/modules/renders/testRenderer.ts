import type { IPlugin, IStore } from '@seek-psd/engine2d';
import type { Store } from '../../store';

export class TestRenderer implements IPlugin<Store> {
  private store: IStore = null;
  private userStores: Store = null;

  constructor() {}

  call($store: IStore, $userStores: Store): void {
    this.store = $store;
    this.userStores = $userStores;

    //console.log('RENDER');
  }
}
