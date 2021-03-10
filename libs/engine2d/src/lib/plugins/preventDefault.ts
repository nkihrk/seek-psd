/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IStore } from '../store';
import { Plugin } from '../Global';

export class PreventDefault extends Plugin<any> {
  constructor() {
    super();
  }

  call($store: IStore, $userStore: any): void {
    super.call($store, $userStore);

    this.store.defaultEvent.preventDefault();
  }
}
