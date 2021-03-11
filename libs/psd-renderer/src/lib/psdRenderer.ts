import { Engine2D, Entity, EVENT_TYPE, IPluginSet } from '@seek-psd/engine2d';
import {
  PreventDefault,
  StopPropagation,
  FileLoader,
} from '@seek-psd/engine2d-plugins';
import type { IUserStore } from './store';
import { Store } from './store';
import { LoadPsd } from './modules/events/loadPsd';
import { ShapePsdData } from './modules/events/shapePsdData';

export interface IRenderTargetSet {
  renderTargetName: string;
  renderTarget: HTMLCanvasElement;
}

export class PsdRenderer {
  private targetElement: HTMLElement = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pluginSets: IPluginSet<any>[] = [
    {
      pluginName: 'preventDefault',
      plugin: new PreventDefault(EVENT_TYPE.DRAG),
    },
    {
      pluginName: 'stopPropagation',
      plugin: new StopPropagation(EVENT_TYPE.DRAG),
    },
    {
      pluginName: 'fileLoader',
      plugin: new FileLoader(),
    },
    {
      pluginName: 'loadPsd',
      plugin: new LoadPsd(),
    },
    {
      pluginName: 'shapePsdData',
      plugin: new ShapePsdData(),
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
