import type { IPlugin, IStore } from '@seek-psd/engine2d';
import type { Store } from '../../store';

export class TestEvent implements IPlugin<Store> {
  private store: IStore = null;
  private userStore: Store = null;

  constructor() {}

  call($store: IStore, $userStore: Store): void {
    this.store = $store;
    this.userStore = $userStore;

    //console.log('POINTER');
  }
}
