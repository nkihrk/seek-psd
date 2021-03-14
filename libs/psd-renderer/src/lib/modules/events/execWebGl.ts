import type { IStore, IFiles } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import type { IPsd } from '../../entities/psd';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';

export class ExecWebGl extends Plugin<IUserStore> {
  constructor() {
    super({
      pluginType: EVENT_TYPE.DRAG,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    if ($store.flags.drag.isDrop) {
      this._createWebGlCanvas();
      this._render();
    }
  }

  private _createWebGlCanvas(): void {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const gl: WebGLRenderingContext = canvas.getContext('webgl');

    this.userStore.webGlElement = canvas;
  }

  private _render(): void {}
}
