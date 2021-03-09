import type { IStore } from './store';

export interface IPluginSet<T> {
  eventType: string;
  pluginName: string;
  plugin: IPlugin<T>;
}

export interface IPlugin<T> {
  call($store: IStore, $userStore: T): void;
}
