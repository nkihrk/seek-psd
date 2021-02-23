import type { Plugin } from './global.interface';
import { StoreManager } from './storeManager';

export class RendererManager {
  private storeManager: StoreManager = null;
  private static plugins: Plugin[] = [];

  static registerPlugin($plugin: Plugin): void {
    RendererManager.plugins.push($plugin);
  }

  constructor() {}

  init($store: StoreManager): void {
    this.storeManager = $store;
  }

  start(): void {
    if (!this.storeManager) {
      throw new Error('RendererManager is not properly initialized.');
    }

    this._render();
  }

  private _render(): void {
    RendererManager.plugins.forEach((f) => {
      f.call(this.storeManager);
    });
  }
}
