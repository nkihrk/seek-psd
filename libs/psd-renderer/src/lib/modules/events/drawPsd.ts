import type { IStore, IFiles } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import type { IPsd } from '../../entities/psd';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';

export const DRAW_PSD = 'drawPsd';

export class DrawPsd extends Plugin<IUserStore> {
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
        this.draw(psds[i]);
      }
    }
  }

  drawRaw(): void {}

  draw($psd: IPsd): void {
    const c: HTMLCanvasElement = $psd.history.current.element;
    c.width = $psd.rawWidth;
    c.height = $psd.rawHeight;
    const ctx: CanvasRenderingContext2D = c.getContext('2d');
    ctx.drawImage($psd.rawElement, 0, 0, c.width, c.height);
  }
}
