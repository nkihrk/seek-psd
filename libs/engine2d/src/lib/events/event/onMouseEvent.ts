import type { EventNotifier } from '../../notifiers/eventNotifier';
import type { MouseFlags, MouseValues } from '../meta-filters/mouseMetaFilter';
import { MouseMetaFilter } from '../meta-filters/mouseMetaFilter';
import { Event } from './event';

interface FilterContent {
  flags: MouseFlags;
  values: MouseValues;
  filter: MouseMetaFilter;
}

export class OnMouseEvent extends Event {
  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onClick($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onDblClick($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onContextmenu($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  private _getFilterContent($event: MouseEvent): FilterContent {
    const filter = new MouseMetaFilter();
    filter.init($event);
    const flags: MouseFlags = filter.flags;
    const values: MouseValues = filter.values;

    return { flags, values, filter };
  }
}
