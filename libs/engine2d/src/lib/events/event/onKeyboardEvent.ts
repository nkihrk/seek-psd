import type { EventNotifier } from '../../notifiers/eventNotifier';
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
  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onKeydown($event: KeyboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isKeydown = true;

    // notify to the eventManager
    this.eventNotifier.update({ flags, values, default: $event });
  }

  onKeyup($event: KeyboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isKeyup = true;

    // notify to the eventManager
    this.eventNotifier.update({ flags, values, default: $event });
  }

  private _getFilterContent($event: KeyboardEvent): FilterContent {
    const filter = new KeyboardMetaFilter();
    filter.init($event);
    const flags: KeyboardFlags = filter.flags;
    const values: KeyboardValues = filter.values;

    return { flags, values, filter };
  }
}
