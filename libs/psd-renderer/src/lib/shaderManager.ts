export interface IShaders {
  vertex: IShaderSet[];
  fragment: IShaderSet[];
}

export interface IShaderSet {
  name: string;
  program: string;
}

export type TShaderType = SHADER_TYPE.VERTEX | SHADER_TYPE.FRAGMENT;

export enum SHADER_TYPE {
  VERTEX = 'vertex',
  FRAGMENT = 'fragmentr',
}

export class ShaderManager {
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

  constructor() {}

  searchByShaderType($shaderType: TShaderType): IShaderSet[] {
    return this.shaders[$shaderType];
  }

  searchByShaderName(
    $shaderType: TShaderType,
    $shaderName: string
  ): IShaderSet {
    return this.shaders[$shaderType].filter((e) => e.name === $shaderName);
  }
}
