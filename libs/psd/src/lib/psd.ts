import {
  Engine2D,
  Entity,
  EVENT_TYPE,
  FileLoader,
  IPluginSet,
} from '@seek-psd/engine2d';
import { Store } from './store';
import { TestEvent } from './modules/events/testEvent';
import { TestRenderer } from './modules/renderers/testRenderer';

export class SeekPsd {
  private targetElement: HTMLElement = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pluginSets: IPluginSet<any>[] = [
    {
      eventType: EVENT_TYPE.POINTER,
      pluginName: 'test',
      plugin: new TestEvent(),
    },
    {
      eventType: EVENT_TYPE.DRAG,
      pluginName: 'fileLoader',
      plugin: new FileLoader(),
    },
    {
      eventType: EVENT_TYPE.RENDER,
      pluginName: 'test',
      plugin: new TestRenderer(),
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
  }

  private _registerPlugins($eg: Engine2D): void {
    this.pluginSets.forEach((e) => $eg.registerPlugin(e));
  }
}
