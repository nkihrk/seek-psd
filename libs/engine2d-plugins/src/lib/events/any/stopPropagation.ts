/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IStore, TPluginType } from '@seek-psd/engine2d';
import { Plugin, EVENT_TYPE } from '@seek-psd/engine2d';

export const STOP_PROPAGATION = 'stoPropagation';

export class StopPropagation extends Plugin<any> {
  constructor($pluginType?: TPluginType) {
    super({
      pluginType: $pluginType || EVENT_TYPE.ANY,
    });
  }

  call($store: IStore, $userStore: any): void {
    super.call($store, $userStore);

    this.store.defaultEvent.stopPropagation();
  }
}
