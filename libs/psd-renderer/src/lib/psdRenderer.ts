import type { IUserStore, IRenderTargetSet } from './store';
import type { IPluginSet } from '@seek-psd/engine2d';
import { Engine2D, Entity, EVENT_TYPE } from '@seek-psd/engine2d';
import {
  PLUGIN as PRESET_PLUGIN,
  PreventDefault,
  StopPropagation,
  FileLoader,
} from '@seek-psd/engine2d-plugins';
import { PLUGIN } from './constants';
import { Store } from './store';
import { LoadPsd } from './modules/events/loadPsd';
import { ShapePsd } from './modules/events/shapePsd';
import { ExecPsd } from './modules/events/execPsd';
import { ExecWebGl } from './modules/events/execWebGl';
import { RenderCanvas } from './modules/renders/renderCanvas';
import { RenderTestWebGl } from './modules/renders/renderTestWebGl';

export class PsdRenderer {
  private targetElement: HTMLElement = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pluginSets: IPluginSet<any>[] = [
    {
      pluginName: PRESET_PLUGIN.PREVENT_DEFAULT,
      plugin: new PreventDefault(EVENT_TYPE.DRAG),
    },
    {
      pluginName: PRESET_PLUGIN.STOP_PROPAGATION,
      plugin: new StopPropagation(EVENT_TYPE.DRAG),
    },
    {
      pluginName: PLUGIN.FILE_LOADER,
      plugin: new FileLoader(),
    },
    {
      pluginName: PLUGIN.LOAD_PSD,
      plugin: new LoadPsd(),
    },
    {
      pluginName: PLUGIN.SHAPE_PSD,
      plugin: new ShapePsd(),
    },
    {
      pluginName: PLUGIN.EXEC_PSD,
      plugin: new ExecPsd(),
    },
    {
      pluginName: 'execWebGl',
      plugin: new ExecWebGl(),
    },
    {
      pluginName: PLUGIN.RENDER_CANVAS,
      plugin: new RenderCanvas(),
    },
    {
      pluginName: 'renderTestWebGl',
      plugin: new RenderTestWebGl(),
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
