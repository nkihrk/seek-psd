import type { IStore, ICoord } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { RENDER_TARGET } from '../../constants';

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
    const psdLayer: HTMLCanvasElement = this.userStore.searchRenderTargetByName(
      RENDER_TARGET.PSD_LAYER
    );
    const uiLayer: HTMLCanvasElement = this.userStore.searchRenderTargetByName(
      RENDER_TARGET.UI_LAYER
    );

    this._initCanvas(psdLayer);
    this._initCanvas(uiLayer);
  }

  private _initCanvas($canvas: HTMLCanvasElement): void {
    const c: HTMLCanvasElement = $canvas;
    const rect: DOMRect = this.store.entity.element.getBoundingClientRect();
    c.width = rect.width;
    c.height = rect.height;
  }
}
