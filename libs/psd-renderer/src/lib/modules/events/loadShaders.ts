import type { IStore } from '@seek-psd/engine2d';
import type { IUserStore, IShaders } from '../../store';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';

export const LOAD_SHADERS = 'loadShaders';

export class LoadShaders extends Plugin<IUserStore> {
  private shaders: IShaders = {
    vertex: [
      {
        name: 'rotateVertex',
        program: `
					attribute vec4 aVertexPosition;

    			uniform mat4 uModelViewMatrix;
    			uniform mat4 uProjectionMatrix;

					void main() {
						gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
					}
				`,
      },
    ],
    fragment: [
      {
        name: 'showColor',
        program: `
  				void main() {
						gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);;
					}
				`,
      },
    ],
  };

  constructor() {
    super({
      pluginType: EVENT_TYPE.ANY,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    this._loadShaders();
  }

  private _loadShaders(): void {
    this.userStore.shaders = this.shaders;
  }
}
