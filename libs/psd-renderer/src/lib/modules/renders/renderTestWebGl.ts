import type { IStore, ICoord } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { RENDER_TARGET } from '../../constants';

export class RenderTestWebGl extends Plugin<IUserStore> {
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
    const c: HTMLCanvasElement = this.userStore.searchRenderTargetByName(
      RENDER_TARGET.PSD_LAYER
    );
    const rect: DOMRect = this.store.entity.element.getBoundingClientRect();
    c.width = rect.width;
    c.height = rect.height;
    const ctx: CanvasRenderingContext2D = c.getContext('2d');
    ctx.drawImage(this.userStore.webGlElement, 0, 0);
  }
}
