import type { IStore, ICoord } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import type { IPsd, IPsdState } from '../../entities/psd';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { RENDER_TARGET } from '../../constants';

export const RENDER_CANVAS = 'renderCanvas';

export class RenderCanvas extends Plugin<IUserStore> {
  constructor() {
    // enable notifier
    super({
      pluginType: EVENT_TYPE.RENDER,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    this._render();
  }

  private _render(): void {
    const psds: IPsd[] = this.userStore.psds;
    const c: HTMLCanvasElement = this.userStore.searchRenderTargetByName(
      RENDER_TARGET.PSD_LAYER
    );
    const ctx: CanvasRenderingContext2D = c.getContext('2d');

    for (let i = 0; i < psds.length; i++) {
      const psd: IPsd = psds[i];
      const state: IPsdState = psd.history.current;
      const offset: ICoord = state.offset.new;
      const width: number = state.width;
      const height: number = state.height;

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.drawImage(psd.element, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
  }
}
