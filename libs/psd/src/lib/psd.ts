import { Engine2D, Entity, EVENT_TYPE } from '@seek-psd/engine2d';
import { StoreManager } from './storeManager';
import { TestEvent } from './modules/events/testEvent';
import { FileLoader } from './modules/events/fileLoader';
import { TestRenderer } from './modules/renderers/testRenderer';

export class SeekPsd {
  private targetElement: HTMLElement = null;

  constructor() {}

  init($targetElement: HTMLElement): void {
    this.targetElement = $targetElement;
  }

  start(): void {
    // engine2d
    const entity = new Entity(this.targetElement);
    const eg = new Engine2D();
    // make sure to register all plugins before initializing
    eg.registerStore(new StoreManager());
    eg.registerPlugin(EVENT_TYPE.POINTER, {
      pluginName: 'test',
      plugin: new TestEvent(),
    });
    eg.registerPlugin(EVENT_TYPE.DRAG, {
      pluginName: 'fileLoader',
      plugin: new FileLoader(),
    });
    eg.registerPlugin(EVENT_TYPE.RENDER, {
      pluginName: 'test',
      plugin: new TestRenderer(),
    });
    eg.init(entity);
    eg.start();
  }
}
