import type { IUserStore, IRenderTargetSet } from './store';
import type { IPluginSet } from '@seek-psd/engine2d';
import { Engine2D, Entity, EVENT_TYPE } from '@seek-psd/engine2d';
import {
  PreventDefault,
  PREVENT_DEFAULT,
  StopPropagation,
  STOP_PROPAGATION,
  FileLoader,
  FILE_LOADER,
  ZipLoader,
  ZIP_LOADER,
} from '@seek-psd/engine2d-plugins';
import { Store } from './store';
import { LoadPsd, LOAD_PSD } from './modules/events/loadPsd';
import { ShapePsd, SHAPE_PSD } from './modules/events/shapePsd';
import { DrawPsd, DRAW_PSD } from './modules/events/drawPsd';
import { DrawWebGl, DRAW_WEBGL } from './modules/events/drawWebGl';
import { LoadShaders, LOAD_SHADERS } from './modules/events/loadShaders';
import {
  RenderInitCanvas,
  RENDER_INIT_CANVAS,
} from './modules/renders/renderInitCanvas';
import { RenderCanvas, RENDER_CANVAS } from './modules/renders/renderCanvas';
import { RenderWebGl, RENDER_WEBGL } from './modules/renders/renderWebGl';

export class PsdRenderer {
  private targetElement: HTMLElement = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pluginSets: IPluginSet<any>[] = [
    // load shaders
    {
      pluginName: LOAD_SHADERS,
      plugin: new LoadShaders(),
    },
    // preventDefault when drag event occures
    {
      pluginName: PREVENT_DEFAULT,
      plugin: new PreventDefault(EVENT_TYPE.DRAG),
    },
    // stopPropagation when drag event occures
    {
      pluginName: STOP_PROPAGATION,
      plugin: new StopPropagation(EVENT_TYPE.DRAG),
    },
    // load files
    {
      pluginName: FILE_LOADER,
      plugin: new FileLoader(),
    },
    {
      pluginName: ZIP_LOADER,
      plugin: new ZipLoader(),
    },
    // load psd
    {
      pluginName: LOAD_PSD,
      plugin: new LoadPsd(),
    },
    // shape psd
    {
      pluginName: SHAPE_PSD,
      plugin: new ShapePsd(),
    },
    // draw psd
    {
      pluginName: DRAW_PSD,
      plugin: new DrawPsd(),
    },
    // draw webgl
    {
      pluginName: DRAW_WEBGL,
      plugin: new DrawWebGl(),
    },
    // initialize canvases
    {
      pluginName: RENDER_INIT_CANVAS,
      plugin: new RenderInitCanvas(),
    },
    // render canvas2d
    {
      pluginName: RENDER_CANVAS,
      plugin: new RenderCanvas(),
    },
    // render webgl
    {
      pluginName: RENDER_WEBGL,
      plugin: new RenderWebGl(),
    },
  ];
  private renderTargetSets: IRenderTargetSet[] = [];

  constructor() {}

  init($targetElement: HTMLElement): void {
    this.targetElement = $targetElement;
  }

  registerRenderTargetSet($renderTargetSet: IRenderTargetSet): void {
    this.renderTargetSets.push($renderTargetSet);
  }

  start(): void {
    // engine2d
    const eg = new Engine2D();
    const entity = new Entity(this.targetElement);
    const store = new Store();

    // make sure to register all plugins before initializing
    this._registerPlugins(eg);
    this._registerRenderTargetSets(store);

    // initialize Engine2D
    eg.init(entity, store);

    // start the engine
    eg.start();

    // get notifications when stores are updated
    eg.store.updateNotifier.observer().subscribe((e) => {
      if (e.notifyType === EVENT_TYPE.DRAG) {
        console.log(e);
      }
    });
  }

  private _registerPlugins($eg: Engine2D): void {
    this.pluginSets.forEach((e) => $eg.registerPlugin(e));
  }

  private _registerRenderTargetSets($store: IUserStore): void {
    $store.renderTargetSets = this.renderTargetSets;
  }
}
