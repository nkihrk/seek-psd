import type { PluginSet } from './global.interface';
import { EVENT_TYPE } from './constants/index';

export class PluginManager {
  // Events
  private static clipboards: PluginSet[] = [];
  private static keyboards: PluginSet[] = [];
  private static pointers: PluginSet[] = [];
  private static drags: PluginSet[] = [];
  private static events: PluginSet[] = [];
  private static mouses: PluginSet[] = [];
  private static wheels: PluginSet[] = [];

  // Renderers
  private static renders: PluginSet[] = [];

  static registerPlugin($eventType: string, $pluginSet: PluginSet): void {
    switch ($eventType) {
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

  searchByEventType($eventType: string): PluginSet[] {
    let pluginSets: PluginSet[] = [];

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

  searchByPluginName($eventType: string, $pluginName: string): PluginSet[] {
    const pluginSets: PluginSet[] = this.searchByEventType($eventType);

    return pluginSets.filter((e) => e.pluginName === $pluginName);
  }
}
