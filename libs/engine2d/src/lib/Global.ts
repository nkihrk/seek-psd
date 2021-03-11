import type { IStore } from './store';
import { EVENT_TYPE } from './constants';

export interface IPluginSet<T> {
  pluginName: string;
  plugin: Plugin<T>;
}

export interface IPluginOptions {
  pluginType: TPluginType;
  isNotifierEnabled?: boolean;
}

export type TPluginType =
  | EVENT_TYPE.CLIPBOARD
  | EVENT_TYPE.KEYBOARD
  | EVENT_TYPE.POINTER
  | EVENT_TYPE.DRAG
  | EVENT_TYPE.EVENT
  | EVENT_TYPE.MOUSE
  | EVENT_TYPE.WHEEL
  | EVENT_TYPE.RENDER
  | EVENT_TYPE.ANY;

export abstract class Plugin<T> {
  protected store: IStore = null;
  protected userStore: T = null;
  protected resolve?: () => void = null;
  readonly isNotifierEnabled: boolean;
  readonly pluginType: TPluginType;

  constructor($pluginOptions: IPluginOptions) {
    this.pluginType = $pluginOptions.pluginType;
    this.isNotifierEnabled = !!$pluginOptions.isNotifierEnabled;
  }

  call($store: IStore, $userStore: T): void {
    this.store = $store;
    this.userStore = $userStore;
  }
}
