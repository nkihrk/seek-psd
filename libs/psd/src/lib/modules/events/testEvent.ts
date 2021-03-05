import type { Plugin, StoreManager } from '@seek-psd/engine2d';
import type { Store } from '../../store';

export class TestEvent implements Plugin {
  private store: StoreManager = null;

  constructor() {}

  call($store: StoreManager & Store): void {
    this.store = $store;

    //console.log('POINTER');
  }
}
