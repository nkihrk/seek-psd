import type { IStore, ICoord } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { RENDER_TARGET } from '../../constants';
import { createDecodedImage } from '@seek-psd/utils';

export const RENDER_WEBGL = 'renderWebGl';

export class RenderWebGl extends Plugin<IUserStore> {
  constructor() {
    super({
      pluginType: EVENT_TYPE.RENDER,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    this._render();
  }

  private _render(): void {
    if (!this.userStore.webGlElement) return;

    const src: string = this.userStore.webGlElement.toDataURL();
    const img: HTMLImageElement = createDecodedImage(src);

    const c: HTMLCanvasElement = this.userStore.searchRenderTargetByName(
      RENDER_TARGET.MAIN_LAYER
    );
    const ctx: CanvasRenderingContext2D = c.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }
}
