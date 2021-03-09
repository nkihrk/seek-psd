import { PluginManager } from './pluginManager';
import { StoreManager } from './storeManager';
import { EVENT_TYPE } from './constants';

export class RendererManager {
  private storeManager: StoreManager = null;
  private pluginManager: PluginManager = null;

  constructor() {}

  init($storeManager: StoreManager, $pluginManager: PluginManager): void {
    this.storeManager = $storeManager;
    this.pluginManager = $pluginManager;
  }

  start(): void {
    if (!this.storeManager) {
      throw new Error('RendererManager is not properly initialized.');
    }

    this._render();
  }

  private _render(): void {
    this.pluginManager.searchByEventType(EVENT_TYPE.RENDER).forEach((f) => {
      new f.plugin.call(this.storeManager.store, this.storeManager.userStore);
    });
  }
}
