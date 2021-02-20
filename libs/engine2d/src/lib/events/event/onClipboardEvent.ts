import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type {
  ClipboardFlags,
  ClipboardValues,
} from '../meta-filters/clipboardMetaFilter';
import { ClipboardMetaFilter } from '../meta-filters/clipboardMetaFilter';
import { Event } from './event';

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

    this.notifier.update({
      flags,
      values,
      eventType: 'clipboard',
      default: $event,
    });
  }

  onCopy($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isCopy = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'clipboard',
      default: $event,
    });
  }

  onPaste($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isPaste = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'clipboard',
      default: $event,
    });
  }

  private _getFilterContent($event: ClipboardEvent): FilterContent {
    const filter = new ClipboardMetaFilter();
    filter.init($event);
    const flags: ClipboardFlags = filter.flags;
    const values: ClipboardValues = filter.values;

    return { flags, values, filter };
  }
}
