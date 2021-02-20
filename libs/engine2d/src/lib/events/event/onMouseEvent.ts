import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type { MouseFlags, MouseValues } from '../meta-filters/mouseMetaFilter';
import { MouseMetaFilter } from '../meta-filters/mouseMetaFilter';
import { Event } from './event';

interface FilterContent {
  flags: MouseFlags;
  values: MouseValues;
  filter: MouseMetaFilter;
}

export class OnMouseEvent extends Event {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onClick($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isClick = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'mouse',
      default: $event,
    });
  }

  onDblClick($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDblClick = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'mouse',
      default: $event,
    });
  }

  onContextmenu($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isContextmenu = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'mouse',
      default: $event,
    });
  }

  private _getFilterContent($event: MouseEvent): FilterContent {
    const filter = new MouseMetaFilter();
    filter.init($event);
    const flags: MouseFlags = filter.flags;
    const values: MouseValues = filter.values;

    return { flags, values, filter };
  }
}
