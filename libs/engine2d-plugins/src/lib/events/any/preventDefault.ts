/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IStore, TPluginType } from '@seek-psd/engine2d';
import { Plugin, EVENT_TYPE } from '@seek-psd/engine2d';

export const PREVENT_DEFAULT = 'preventDefault';

export class PreventDefault extends Plugin<any> {
  constructor($pluginType?: TPluginType) {
    super({
      pluginType: $pluginType || EVENT_TYPE.ANY,
    });
  }

  call($store: IStore, $userStore: any): void {
    super.call($store, $userStore);

    this.store.defaultEvent.preventDefault();
  }
}
