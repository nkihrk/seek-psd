import {
  Engine2D,
  Entity,
  EVENT_TYPE,
  FileLoader,
  IPluginSet,
  PreventDefault,
  StopPropagation,
} from '@seek-psd/engine2d';
import { Store } from './store';
import { LoadPsd } from './modules/events/loadPsd';

export class PsdRenderer {
  private targetElement: HTMLElement = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pluginSets: IPluginSet<any>[] = [
    {
      eventType: EVENT_TYPE.DRAG,
      pluginName: 'preventDefault',
      plugin: new PreventDefault(),
    },
    {
      eventType: EVENT_TYPE.DRAG,
      pluginName: 'stopPropagation',
      plugin: new StopPropagation(),
    },
    {
      eventType: EVENT_TYPE.DRAG,
      pluginName: 'fileLoader',
      plugin: new FileLoader(),
    },
    {
      eventType: EVENT_TYPE.DRAG,
      pluginName: 'loadPsd',
      plugin: new LoadPsd(),
    },
  ];

  constructor() {}

  init($targetElement: HTMLElement): void {
    this.targetElement = $targetElement;
  }

  start(): void {
    // engine2d
    const entity = new Entity(this.targetElement);
    const eg = new Engine2D();

    // make sure to register all plugins before initializing
    this._registerPlugins(eg);

    // initialize Engine2D
    eg.init(entity, new Store());

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
}
