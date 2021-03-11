/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IStore } from '@seek-psd/engine2d';
import { Plugin } from '@seek-psd/engine2d';

export class PreventDefault extends Plugin<any> {
  constructor() {
    super();
  }

  call($store: IStore, $userStore: any): void {
    super.call($store, $userStore);

    this.store.defaultEvent.preventDefault();
  }
}
