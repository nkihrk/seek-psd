import type { Entity } from './entities/entity.interface';
import { requestRender } from '@seek-psd/utils';
import { EventManager } from './eventManager';
import { RendererManager } from './rendererManager';
import { StoreManager } from './storeManager';

export class Engine2D {
  private _storeManager: StoreManager;
  private _eventManager: EventManager;
  private _rendererManager: RendererManager;

  constructor($entity: Entity) {
    const storeManager = new StoreManager();
    storeManager.init($entity);
    this._storeManager = storeManager;

    const eventManager = new EventManager();
    eventManager.init(storeManager);
    this._eventManager = eventManager;

    this._rendererManager = new RendererManager();
  }

  get storeManager(): StoreManager {
    return this._storeManager;
  }

  get eventManager(): EventManager {
    return this._eventManager;
  }

  get rendererManager(): RendererManager {
    return this._rendererManager;
  }

  start(): void {
    // start listening events
    this.eventManager.start();

    // start renderer
    const f = () => this._renderer();
    requestRender(f);
  }

  private _renderer(): void {
    this._rendererManager.start();
  }
}
