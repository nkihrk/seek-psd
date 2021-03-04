import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type {
  KeyboardFlags,
  KeyboardValues,
} from '../meta-filters/keyboardMetaFilter';
import { KeyboardMetaFilter } from '../meta-filters/keyboardMetaFilter';
import { Event } from './event';
import { EVENT_TYPE } from '../../constants';

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
    this._publish(flags, values, $event);
  }

  onKeyup($event: KeyboardEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isKeyup = true;

    // notify to the eventManager
    this._publish(flags, values, $event);
  }

  private _getFilterContent($event: KeyboardEvent): FilterContent {
    const filter = new KeyboardMetaFilter();
    filter.init($event);
    const flags: KeyboardFlags = filter.flags;
    const values: KeyboardValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: KeyboardFlags,
    $values: KeyboardValues,
    $event: KeyboardEvent
  ): void {
    this.notifier.update({
      flags: $flags,
      values: $values,
      eventType: EVENT_TYPE.KEYBOARD,
      default: $event,
    });
  }
}
