import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type {
  ClipboardFlags,
  ClipboardValues,
} from '../meta-filters/clipboardMetaFilter';
import { ClipboardMetaFilter } from '../meta-filters/clipboardMetaFilter';
import { Event } from './event';
import { EVENT_TYPE } from '../../constants';

interface FilterContent {
  flags: ClipboardFlags;
  values: ClipboardValues;
  filter: ClipboardMetaFilter;
}

export class OnClipboardEvent extends Event {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onCut($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isCut = true;

    this._publish(flags, values, $event);
  }

  onCopy($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isCopy = true;

    this._publish(flags, values, $event);
  }

  onPaste($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isPaste = true;

    this._publish(flags, values, $event);
  }

  private _getFilterContent($event: ClipboardEvent): FilterContent {
    const filter = new ClipboardMetaFilter();
    filter.init($event);
    const flags: ClipboardFlags = filter.flags;
    const values: ClipboardValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: ClipboardFlags,
    $values: ClipboardValues,
    $event: ClipboardEvent
  ): void {
    this.notifier.update({
      flags: $flags,
      values: $values,
      eventType: EVENT_TYPE.CLIPBOARD,
      defaultEvent: $event,
    });
  }
}
