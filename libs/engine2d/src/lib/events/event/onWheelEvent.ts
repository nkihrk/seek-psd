import type { EventNotifier } from '../../notifiers/eventNotifier';
import type { WheelFlags, WheelValues } from '../meta-filters/wheelMetaFilter';
import { WheelMetaFilter } from '../meta-filters/wheelMetaFilter';
import { Event } from './event';
import { WHEEL_INTERVAL } from '../../constants/index';

export class OnWheelEvent extends Event {
  private wheelCounter1 = 0;
  private wheelCounter2 = 0;
  private wheelMaker = true;

  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onWheel($event: WheelEvent): void {
    const filter = new WheelMetaFilter();
    filter.init($event);
    const flags: WheelFlags = filter.flags;
    const values: WheelValues = filter.values;

    // watch wheel events to detect an end of the event
    if (this.wheelCounter1 === 0) flags.isWheelStart = true;
    this._detectWheelEnd();

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'wheel',
      default: $event,
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
