import type { StoreManager } from './storeManager';

export type { StoreManager } from './storeManager';

export interface PluginSet {
  pluginName: string;
  plugin: Plugin;
}

export interface Plugin {
  call($store: StoreManager): void;
}
