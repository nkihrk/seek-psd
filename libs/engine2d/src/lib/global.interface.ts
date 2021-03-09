import type { IStore } from './store';

export type { IStore } from './store';

export interface IPluginSet<T> {
  pluginName: string;
  plugin: IPlugin<T>;
}

export interface IPlugin<T> {
  call($store: IStore, $userStore: T): void;
}
