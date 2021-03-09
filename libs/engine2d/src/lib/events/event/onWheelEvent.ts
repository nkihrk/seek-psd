import type { Notifier } from '../../notifiers/notifier';
import type {
  IWheelFlags,
  IWheelValues,
} from '../meta-filters/wheelMetaFilter';
import type { FilterResult } from './event';
import { WheelMetaFilter } from '../meta-filters/wheelMetaFilter';
import { Event } from './event';
import { EVENT_TYPE, WHEEL_INTERVAL } from '../../constants/index';

export class OnWheelEvent extends Event {
  private wheelCounter1 = 0;
  private wheelCounter2 = 0;
  private wheelMaker = true;

  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onWheel($event: WheelEvent): void {
    const filter = new WheelMetaFilter();
    filter.init($event);
    const flags: IWheelFlags = filter.flags;
    const values: IWheelValues = filter.values;

    // watch wheel events to detect an end of the event
    if (this.wheelCounter1 === 0) flags.isWheelStart = true;
    this._detectWheelEnd();

    this.notifier.update({
      flags,
      values,
      eventType: EVENT_TYPE.WHEEL,
      defaultEvent: $event,
    });
  }

  // https://jsfiddle.net/rafaylik/sLjyyfox/
  private _detectWheelEnd(): void {
    this.wheelCounter1 += 1;
    if (this.wheelMaker) this._wheelStart();
  }

  private _wheelStart(): void {
    this.wheelMaker = false;
    this._wheelAct();
  }

  private _wheelAct(): void {
    this.wheelCounter2 = this.wheelCounter1;
    setTimeout(() => {
      if (this.wheelCounter2 === this.wheelCounter1) {
        this._wheelEnd();
      } else {
        this._wheelAct();
      }
    }, WHEEL_INTERVAL);
  }

  private _wheelEnd(): void {
    this.wheelCounter1 = 0;
    this.wheelCounter2 = 0;
    this.wheelMaker = true;
  }
}
