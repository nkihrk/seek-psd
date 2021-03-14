import type { IStore, IFiles } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import type { IPsd } from '../../entities/psd';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';

export class ExecPsd extends Plugin<IUserStore> {
  constructor() {
    super({
      pluginType: EVENT_TYPE.DRAG,
      isNotifierEnabled: true,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    if ($store.flags.drag.isDrop) {
      const psds: IPsd[] = this.userStore.psds;

      for (let i = 0; i < psds.length; i++) {
        this.render(psds[i]);
      }
    }
  }

  renderRaw(): void {}

  render($psd: IPsd): void {
    const aspectRatio: number = $psd.rawHeight / $psd.rawWidth;
  }
}
