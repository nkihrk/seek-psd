import type { Entity } from './entities/entity';
import type { IPluginSet } from './global.interface';
import { requestRender } from '@seek-psd/utils';
import { StoreManager } from './storeManager';
import { EventManager } from './eventManager';
import { PluginManager } from './pluginManager';
import { RendererManager } from './rendererManager';

export class Engine2D {
  private _storeManager: StoreManager = null;
  private _pluginManager: PluginManager = null;
  private _eventManager: EventManager = null;
  private _rendererManager: RendererManager = null;

  constructor() {}

  get store(): StoreManager {
    return this._storeManager;
  }

  get plugin(): PluginManager {
    return this._pluginManager;
  }

  get event(): EventManager {
    return this._eventManager;
  }

  get renderer(): RendererManager {
    return this._rendererManager;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerPlugin($pluginSet: IPluginSet<any>): void {
    PluginManager.registerPlugin($pluginSet);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init($entity?: Entity, $userStore?: any): void {
    const storeManager = new StoreManager();
    if ($entity) storeManager.initEntity($entity);
    if ($userStore) storeManager.registerStore($userStore);
    this._storeManager = storeManager;

    const pluginManager = new PluginManager();
    this._pluginManager = pluginManager;

    const eventManager = new EventManager();
    eventManager.init(storeManager, pluginManager);
    this._eventManager = eventManager;

    const rendererManager = new RendererManager();
    rendererManager.init(storeManager, pluginManager);
    this._rendererManager = rendererManager;
  }

  start(): void {
    // start listening events
    this.event.start();

    // start renderer
    const f = () => this._renderer();
    requestRender(f);
  }

  private _renderer(): void {
    this.renderer.start();
  }
}
