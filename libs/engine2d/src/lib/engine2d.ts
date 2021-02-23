import type { Entity } from './entities/entity.interface';
import type { Plugin } from './global.interface';
import { requestRender } from '@seek-psd/utils';
import { EventManager } from './eventManager';
import { RendererManager } from './rendererManager';
import { StoreManager } from './storeManager';

export class Engine2D {
  private _storeManager: StoreManager = null;
  private _eventManager: EventManager = null;
  private _rendererManager: RendererManager = null;

  constructor() {}

  get store(): StoreManager {
    return this._storeManager;
  }

  get event(): EventManager {
    return this._eventManager;
  }

  get renderer(): RendererManager {
    return this._rendererManager;
  }

  registerStore($store: any): void {
    StoreManager.registerPlugin($store);
  }

  registerEvent($eventType: string, $event: Plugin): void {
    EventManager.registerPlugin($eventType, $event);
  }

  registerRenderer($renderer: Plugin): void {
    RendererManager.registerPlugin($renderer);
  }

  init($entity: Entity): void {
    const storeManager = new StoreManager();
    storeManager.init($entity);
    this._storeManager = storeManager;

    const eventManager = new EventManager();
    eventManager.init(storeManager);
    this._eventManager = eventManager;

    const rendererManager = new RendererManager();
    rendererManager.init(storeManager);
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
