import { Engine2D, Entity, EVENT_TYPE, IPluginSet } from '@seek-psd/engine2d';
import {
  PLUGIN as PRESET_PLUGIN,
  PreventDefault,
  StopPropagation,
  FileLoader,
} from '@seek-psd/engine2d-plugins';
import type { IUserStore, IRenderTargetSet } from './store';
import { Store } from './store';
import { LoadPsd } from './modules/events/loadPsd';
import { ShapePsdData } from './modules/events/shapePsdData';
import { PLUGIN } from './constants';
import { RenderCanvas } from './modules/renders/renderCanvas';

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
      pluginName: PLUGIN.SHAPE_PSD_DATA,
      plugin: new ShapePsdData(),
    },
    {
      pluginName: PLUGIN.RENDER_CANVAS,
      plugin: new RenderCanvas(),
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
      if (e.type === EVENT_TYPE.DRAG) {
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
