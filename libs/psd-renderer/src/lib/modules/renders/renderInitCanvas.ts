import type { IStore, ICoord } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { RENDER_TARGET } from '../../constants';
import { makePixelPerfect } from '@seek-psd/utils';

export const RENDER_INIT_CANVAS = 'renderInitCanvas';

export class RenderInitCanvas extends Plugin<IUserStore> {
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
    const mainLayer: HTMLCanvasElement = this.userStore.searchRenderTargetByName(
      RENDER_TARGET.MAIN_LAYER
    );
    const uiLayer: HTMLCanvasElement = this.userStore.searchRenderTargetByName(
      RENDER_TARGET.UI_LAYER
    );

    makePixelPerfect(mainLayer);
    makePixelPerfect(uiLayer);
  }
}
