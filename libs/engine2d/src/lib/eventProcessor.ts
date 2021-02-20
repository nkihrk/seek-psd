import type { NotifiedEvent, FilterResult } from './notifiers/eventNotifier';
import type { StoreManager } from './storeManager';

export class EventProcessor {
  private storeManager: StoreManager;

  constructor($storeManager: StoreManager) {
    this.storeManager = $storeManager;
  }

  process($result: NotifiedEvent): void {
    const eventType: string = $result.event.eventType;

    if ($result.type === 'global') {
      if (eventType === 'clipboard') {
      } else if (eventType === 'keyboard') {
      } else if (eventType === 'pointer') {
        this._pointer($result.event);
      } else if (eventType === 'drag') {
      } else if (eventType === 'event') {
      } else if (eventType === 'mouse') {
      } else if (eventType === 'wheel') {
      }
    } else if ($result.type === 'target') {
      if (eventType === 'pointer') {
      } else if (eventType === 'drag') {
      } else if (eventType === 'mouse') {
      } else if (eventType === 'wheel') {
      }
    }
  }

  private _pointer($result: FilterResult): void {
    console.log($result);
    this.storeManager.updatePointerOffset($result.flags, $result.values);
  }
}
