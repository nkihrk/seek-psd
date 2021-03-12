import type { Notifier } from '../../notifiers/notifier';
import type {
  IEventFlags,
  IEventValues,
} from '../meta-filters/eventMetaFilter';
import type { IEventOptions } from './event';
import { EventMetaFilter } from '../meta-filters/eventMetaFilter';
import { Event as CommonEvent } from './event';
import { EVENT_TYPE } from '../../constants';

interface IFilterContent {
  flags: IEventFlags;
  values: IEventValues;
  filter: EventMetaFilter;
}

export class OnEvent extends CommonEvent {
  constructor($eventOptions: IEventOptions) {
    super($eventOptions);
  }

  onFullscreenchange($event: Event): void {
    const { flags, values } = this._getFilterContent($event);
    this._publish(flags, values, $event);
  }

  onFullscreenerror($event: Event): void {
    const { flags, values } = this._getFilterContent($event);
    this._publish(flags, values, $event);
  }

  onOnline($event: Event): void {
    const { flags, values } = this._getFilterContent($event);
    this._publish(flags, values, $event);
  }

  onOffline($event: Event): void {
    const { flags, values } = this._getFilterContent($event);
    this._publish(flags, values, $event);
  }

  private _getFilterContent($event: Event): IFilterContent {
    const filter = new EventMetaFilter();
    filter.init($event);
    const flags: IEventFlags = filter.flags;
    const values: IEventValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: IEventFlags,
    $values: IEventValues,
    $event: Event
  ): void {
    this.notifier.update({
      flags: $flags,
      values: $values,
      eventType: EVENT_TYPE.EVENT,
      defaultEvent: $event,
    });
  }
}
