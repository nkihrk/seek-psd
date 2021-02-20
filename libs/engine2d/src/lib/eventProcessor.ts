import type { Notifier, NotifiedEvent } from './notifiers/notifier';
import type { StoreManager } from './storeManager';

export class EventProcessor {
  private readonly notifier: Notifier<any>;
  private storeManager: StoreManager;

  constructor($notifier: Notifier<any>) {
    this.notifier = $notifier;
  }

  init($storeManager: StoreManager): void {
    this.storeManager = $storeManager;
  }

  process($result: NotifiedEvent): void {
    const eventType: string = $result.content.eventType;

    if ($result.type === 'global') {
      if (eventType === 'clipboard') {
      } else if (eventType === 'keyboard') {
      } else if (eventType === 'pointer') {
        this._pointer($result.content);
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

  private _pointer($result: any): void {
    this.storeManager.updatePointerOffset($result.flags, $result.values);
    console.log(this.storeManager.pointerOffset);
  }
}
