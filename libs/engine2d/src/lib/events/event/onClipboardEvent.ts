import type { EventNotifier } from '../../notifiers/eventNotifier';
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
  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onCut($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isCut = true;

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onCopy($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isCopy = true;

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPaste($event: ClipboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isPaste = true;

    this.eventNotifier.update({ flags, values, default: $event });
  }

  private _getFilterContent($event: ClipboardEvent): FilterContent {
    const filter = new ClipboardMetaFilter();
    filter.init($event);
    const flags: ClipboardFlags = filter.flags;
    const values: ClipboardValues = filter.values;

    return { flags, values, filter };
  }
}
