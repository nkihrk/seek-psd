import type { IStore } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import { Plugin } from '@seek-psd/engine2d';
import { EVENT_TYPE } from '@seek-psd/engine2d';

export const DRAW_WEBGL = 'drawWebGl';

interface IProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
  };
}

interface IBuffers {
  position: WebGLBuffer;
}

export class DrawWebGl extends Plugin<IUserStore> {
  private gl: WebGLRenderingContext = null;

  constructor() {
    super({
      pluginType: EVENT_TYPE.DRAG,
    });
  }

  call($store: IStore, $userStore: IUserStore): void {
    super.call($store, $userStore);

    if ($store.flags.drag.isDrop) {
      this._createWebGlCanvas();
      this._main();
    }
  }

  private _createWebGlCanvas(): void {
    const c: HTMLCanvasElement = document.createElement('canvas');
    const gl: WebGLRenderingContext = c.getContext('webgl', {
      preserveDrawingBuffer: true,
    });

    // only continue if WebGL is available and working
    if (gl === null) {
      alert(
        'Unable to initialize WebGL. Your browser or machine may not support it.'
      );
      return;
    }

    this.userStore.webGlElement = c;
    this.gl = gl;
  }

  private _main(): void {
    const c = this.userStore.webGlElement;
    const gl = this.gl;

    const vsSource: string = this.userStore.shaders.vertex[0].program;
    const fsSource: string = this.userStore.shaders.fragment[0].program;
    const shaderProgram: WebGLProgram = this._initShaderProgram(
      gl,
      vsSource,
      fsSource
    );

    const programInfo: IProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram,
          'uProjectionMatrix'
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram,
          'uModelViewMatrix'
        ),
      },
    };

    const buffers: IBuffers = this._initBuffers();

    this._drawScene(programInfo, buffers);
  }

  private _initShaderProgram(
    $gl: WebGLRenderingContext,
    $vsSource: string,
    $fsSource: string
  ): WebGLProgram {
    const vertexShader = this._loadShader($gl, $gl.VERTEX_SHADER, $vsSource);
    const fragmentShader = this._loadShader(
      $gl,
      $gl.FRAGMENT_SHADER,
      $fsSource
    );

    const shaderProgram = $gl.createProgram();
    $gl.attachShader(shaderProgram, vertexShader);
    $gl.attachShader(shaderProgram, fragmentShader);
    $gl.linkProgram(shaderProgram);

    if (!$gl.getProgramParameter(shaderProgram, $gl.LINK_STATUS)) {
      alert(
        'Unable to initialize the shader program: ' +
          $gl.getProgramInfoLog(shaderProgram)
      );

      return null;
    }

    return shaderProgram;
  }

  private _loadShader(
    $gl: WebGLRenderingContext,
    $type: number,
    $source: string
  ) {
    const shader = $gl.createShader($type);

    $gl.shaderSource(shader, $source);
    $gl.compileShader(shader);

    if (!$gl.getShaderParameter(shader, $gl.COMPILE_STATUS)) {
      alert(
        'An error occurred compiling the shaders: ' +
          $gl.getShaderInfoLog(shader)
      );
      $gl.deleteShader(shader);

      return null;
    }

    return shader;
  }

  private _initBuffers(): IBuffers {
    const gl = this.gl;
    const positionBuffer: WebGLBuffer = gl.createBuffer();
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
    };
  }

  private _drawScene($programInfo: IProgramInfo, $buffers: IBuffers): void {
    const gl = this.gl;

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  }
}
