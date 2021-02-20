import type { EventNotifier } from '../../notifiers/eventNotifier';
import type { EventFlags, EventValues } from '../meta-filters/eventMetaFilter';
import { EventMetaFilter } from '../meta-filters/eventMetaFilter';
import { Event as CommonEvent } from './event';

interface FilterContent {
  flags: EventFlags;
  values: EventValues;
  filter: EventMetaFilter;
}

export class OnEvent extends CommonEvent {
  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onFullscreenchange($event: Event): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'event',
      default: $event,
    });
  }

  onFullscreenerror($event: Event): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'event',
      default: $event,
    });
  }

  onOnline($event: Event): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'event',
      default: $event,
    });
  }

  onOffline($event: Event): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'event',
      default: $event,
    });
  }

  private _getFilterContent($event: Event): FilterContent {
    const filter = new EventMetaFilter();
    filter.init($event);
    const flags: EventFlags = filter.flags;
    const values: EventValues = filter.values;

    return { flags, values, filter };
  }
}
