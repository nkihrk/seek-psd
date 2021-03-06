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
      RENDER_TARGET.MAIN_LAYER
    );
    const ctx: CanvasRenderingContext2D = c.getContext('2d');

    for (let i = 0; i < psds.length; i++) {
      const psd: IPsd = psds[i];
      const state: IPsdState = psd.history.current;
      const offset: ICoord = { x: c.width / 2, y: c.height / 2 };
      const scale: number = c.height / psd.rawHeight;
      const width: number = psd.rawWidth * scale;
      const height: number = psd.rawHeight * scale;

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.drawImage(state.element, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
  }
}
