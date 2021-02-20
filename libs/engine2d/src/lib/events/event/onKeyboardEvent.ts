import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type {
  KeyboardFlags,
  KeyboardValues,
} from '../meta-filters/keyboardMetaFilter';
import { KeyboardMetaFilter } from '../meta-filters/keyboardMetaFilter';
import { Event } from './event';

interface FilterContent {
  flags: KeyboardFlags;
  values: KeyboardValues;
  filter: KeyboardMetaFilter;
}

export class OnKeyboardEvent extends Event {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onKeydown($event: KeyboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isKeydown = true;

    // notify to the eventManager
    this.notifier.update({
      flags,
      values,
      eventType: 'keyboard',
      default: $event,
    });
  }

  onKeyup($event: KeyboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isKeyup = true;

    // notify to the eventManager
    this.notifier.update({
      flags,
      values,
      eventType: 'keyboard',
      default: $event,
    });
  }

  private _getFilterContent($event: KeyboardEvent): FilterContent {
    const filter = new KeyboardMetaFilter();
    filter.init($event);
    const flags: KeyboardFlags = filter.flags;
    const values: KeyboardValues = filter.values;

    return { flags, values, filter };
  }
}
