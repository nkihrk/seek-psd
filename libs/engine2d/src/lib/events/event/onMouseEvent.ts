import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type {
  IMouseFlags,
  IMouseValues,
} from '../meta-filters/mouseMetaFilter';
import { MouseMetaFilter } from '../meta-filters/mouseMetaFilter';
import { Event } from './event';
import { EVENT_TYPE } from '../../constants';

interface FilterContent {
  flags: IMouseFlags;
  values: IMouseValues;
  filter: MouseMetaFilter;
}

export class OnMouseEvent extends Event {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onClick($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isClick = true;

    this._publish(flags, values, $event);
  }

  onDblClick($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDblClick = true;

    this._publish(flags, values, $event);
  }

  onContextmenu($event: MouseEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isContextmenu = true;

    this._publish(flags, values, $event);
  }

  private _getFilterContent($event: MouseEvent): FilterContent {
    const filter = new MouseMetaFilter();
    filter.init($event);
    const flags: IMouseFlags = filter.flags;
    const values: IMouseValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: IMouseFlags,
    $values: IMouseValues,
    $event: MouseEvent
  ): void {
    this.notifier.update({
      flags: $flags,
      values: $values,
      eventType: EVENT_TYPE.MOUSE,
      defaultEvent: $event,
    });
  }
}
