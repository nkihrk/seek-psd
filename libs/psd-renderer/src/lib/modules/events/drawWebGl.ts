import type { IStore, IFiles } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import type { IPsd } from '../../entities/psd';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';

export const DRAW_WEBGL = 'drawWebGl';

export class DrawWebGl extends Plugin<IUserStore> {
  constructor() {
    super({
      pluginType: EVENT_TYPE.DRAG,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    if ($store.flags.drag.isDrop) {
      this._createWebGlCanvas();
      this._draw();
    }
  }

  private _createWebGlCanvas(): void {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const gl: WebGLRenderingContext = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
    });

    // Only continue if WebGL is available and working
    if (gl === null) {
      alert(
        'Unable to initialize WebGL. Your browser or machine may not support it.'
      );
      return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.userStore.webGlElement = canvas;
  }

  private _draw(): void {}
}
