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
					attribute vec2 aVertexPosition;
					uniform vec2 uScalingFactor;

					uniform vec2 uRotationVector;

					void main() {
						vec2 rotatedPosition = vec2(
							aVertexPosition.x * uRotationVector.y +
							aVertexPosition.y * uRotationVector.x,
							aVertexPosition.y * uRotationVector.y -
							aVertexPosition.x * uRotationVector.x
						);

						gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);
					}
				`,
      },
    ],
    fragment: [
      {
        name: 'showColor',
        program: `
					#ifdef GL_ES
						precision highp float;
					#endif

					uniform vec4 uGlobalColor;

  				void main() {
						gl_FragColor = uGlobalColor;
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
