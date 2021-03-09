import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type {
  IClipboardFlags,
  IClipboardValues,
} from '../meta-filters/clipboardMetaFilter';
import { ClipboardMetaFilter } from '../meta-filters/clipboardMetaFilter';
import { Event } from './event';
import { EVENT_TYPE } from '../../constants';

interface FilterContent {
  flags: IClipboardFlags;
  values: IClipboardValues;
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
    const flags: IClipboardFlags = filter.flags;
    const values: IClipboardValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: IClipboardFlags,
    $values: IClipboardValues,
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
