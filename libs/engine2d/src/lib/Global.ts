import type { IStore } from './store';

export interface IPluginSet<T> {
  eventType: string;
  pluginName: string;
  plugin: Plugin<T>;
}

export abstract class Plugin<T> {
  protected store: IStore = null;
  protected userStore: T = null;
  protected resolve?: () => void = null;
  readonly isNotifierEnabled: boolean;

  constructor($isNotifierEnabled?: boolean) {
    this.isNotifierEnabled = !!$isNotifierEnabled;
  }

  call($store: IStore, $userStore: T): void {
    this.store = $store;
    this.userStore = $userStore;
  }
}
