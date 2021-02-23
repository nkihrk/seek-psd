import type { StoreManager } from './storeManager';

export type { StoreManager } from './storeManager';

export interface Plugin {
  call($store: StoreManager): void;
}
