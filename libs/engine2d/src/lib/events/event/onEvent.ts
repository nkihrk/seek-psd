import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type {
  IEventFlags,
  IEventValues,
} from '../meta-filters/eventMetaFilter';
import { EventMetaFilter } from '../meta-filters/eventMetaFilter';
import { Event as CommonEvent } from './event';
import { EVENT_TYPE } from '../../constants';

interface FilterContent {
  flags: IEventFlags;
  values: IEventValues;
  filter: EventMetaFilter;
}

export class OnEvent extends CommonEvent {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
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

  private _getFilterContent($event: Event): FilterContent {
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
