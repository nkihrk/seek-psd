/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IPluginSet } from './Global';
import { EVENT_TYPE } from './constants';

export interface IPlugins {
  [pluginType: string]: IPluginSet<any>[];
}

export class PluginManager {
  // any
  private static anys: IPluginSet<any>[] = [];

  // events
  private static clipboards: IPluginSet<any>[] = [];
  private static keyboards: IPluginSet<any>[] = [];
  private static pointers: IPluginSet<any>[] = [];
  private static drags: IPluginSet<any>[] = [];
  private static events: IPluginSet<any>[] = [];
  private static mouses: IPluginSet<any>[] = [];
  private static wheels: IPluginSet<any>[] = [];

  // renders
  private static renders: IPluginSet<any>[] = [];

  // plugins
  private static plugins: IPlugins = {
    [EVENT_TYPE.ANY]: PluginManager.anys,
    [EVENT_TYPE.CLIPBOARD]: PluginManager.clipboards,
    [EVENT_TYPE.KEYBOARD]: PluginManager.keyboards,
    [EVENT_TYPE.POINTER]: PluginManager.pointers,
    [EVENT_TYPE.DRAG]: PluginManager.drags,
    [EVENT_TYPE.EVENT]: PluginManager.events,
    [EVENT_TYPE.MOUSE]: PluginManager.mouses,
    [EVENT_TYPE.WHEEL]: PluginManager.wheels,
    [EVENT_TYPE.RENDER]: PluginManager.renders,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static registerPlugin($pluginSet: IPluginSet<any>): void {
    const pluginType: string = $pluginSet.plugin.pluginType;

    if (PluginManager.plugins[pluginType]) {
      PluginManager.plugins[pluginType].push($pluginSet);
    } else {
      throw new Error('Invalid plugin category is detected.');
    }
  }

  constructor() {}

  searchPluginsByEventType($eventType: string): IPluginSet<any>[] {
    let pluginSets: IPluginSet<any>[] = [];

    if (PluginManager.plugins[$eventType]) {
      pluginSets = PluginManager.plugins[$eventType];
    } else {
      throw new Error('Invalid plugin category is detected.');
    }

    return pluginSets;
  }

  searchPluginByName($eventType: string, $pluginName: string): IPluginSet<any> {
    const pluginSets: IPluginSet<any>[] = this.searchPluginsByEventType(
      $eventType
    );

    return pluginSets.filter((e) => e.pluginName === $pluginName)[0];
  }

  searchPluginNameByIndex($eventType: string, $index: number): string {
    const pluginSets: IPluginSet<any>[] = this.searchPluginsByEventType(
      $eventType
    );

    return pluginSets[$index].pluginName;
  }
}
