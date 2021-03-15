import type { IStore } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';

export const LOAD_SHADERS = 'loadShaders';

export class LoadShaders extends Plugin<IUserStore> {
  constructor() {
    super({
      pluginType: EVENT_TYPE.ANY,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);
  }
}
