/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IPluginSet } from './global.interface';
import { EVENT_TYPE } from './constants/index';

export class PluginManager {
  // Events
  private static clipboards: IPluginSet<any>[] = [];
  private static keyboards: IPluginSet<any>[] = [];
  private static pointers: IPluginSet<any>[] = [];
  private static drags: IPluginSet<any>[] = [];
  private static events: IPluginSet<any>[] = [];
  private static mouses: IPluginSet<any>[] = [];
  private static wheels: IPluginSet<any>[] = [];

  // Renderers
  private static renders: IPluginSet<any>[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static registerPlugin($pluginSet: IPluginSet<any>): void {
    switch ($pluginSet.eventType) {
      case EVENT_TYPE.CLIPBOARD:
        PluginManager.clipboards.push($pluginSet);
        break;

      case EVENT_TYPE.KEYBOARD:
        PluginManager.keyboards.push($pluginSet);
        break;

      case EVENT_TYPE.POINTER:
        PluginManager.pointers.push($pluginSet);
        break;

      case EVENT_TYPE.DRAG:
        PluginManager.drags.push($pluginSet);
        break;

      case EVENT_TYPE.EVENT:
        PluginManager.events.push($pluginSet);
        break;

      case EVENT_TYPE.MOUSE:
        PluginManager.mouses.push($pluginSet);
        break;

      case EVENT_TYPE.WHEEL:
        PluginManager.wheels.push($pluginSet);
        break;

      case EVENT_TYPE.RENDER:
        PluginManager.renders.push($pluginSet);
        break;

      default:
        throw new Error('Invalid plugin category is detected.');
        break;
    }
  }

  constructor() {}

  searchByEventType($eventType: string): IPluginSet<any>[] {
    let pluginSets: IPluginSet<any>[] = [];

    switch ($eventType) {
      case EVENT_TYPE.CLIPBOARD:
        pluginSets = PluginManager.clipboards;
        break;

      case EVENT_TYPE.KEYBOARD:
        pluginSets = PluginManager.keyboards;
        break;

      case EVENT_TYPE.POINTER:
        pluginSets = PluginManager.pointers;
        break;

      case EVENT_TYPE.DRAG:
        pluginSets = PluginManager.drags;
        break;

      case EVENT_TYPE.EVENT:
        pluginSets = PluginManager.events;
        break;

      case EVENT_TYPE.MOUSE:
        pluginSets = PluginManager.mouses;
        break;

      case EVENT_TYPE.WHEEL:
        pluginSets = PluginManager.wheels;
        break;

      case EVENT_TYPE.RENDER:
        pluginSets = PluginManager.renders;
        break;

      default:
        throw new Error('Invalid plugin category is detected.');
        break;
    }

    return pluginSets;
  }

  searchByPluginName(
    $eventType: string,
    $pluginName: string
  ): IPluginSet<any>[] {
    const pluginSets: IPluginSet<any>[] = this.searchByEventType($eventType);

    return pluginSets.filter((e) => e.pluginName === $pluginName);
  }
}
