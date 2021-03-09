import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type { IDragFlags, IDragValues } from '../meta-filters/dragMetaFilter';
import { DragMetaFilter } from '../meta-filters/dragMetaFilter';
import { Event } from './event';

import { EVENT_TYPE } from '../../constants';

interface FilterContent {
  flags: IDragFlags;
  values: IDragValues;
  filter: DragMetaFilter;
}

export class OnDragEvent extends Event {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onDrag($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDrag = true;

    this._publish(flags, values, $event);
  }

  onDragend($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragEnd = true;

    this._publish(flags, values, $event);
  }

  onDragenter($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragEnter = true;

    this._publish(flags, values, $event);
  }

  onDragstart($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragStart = true;

    this._publish(flags, values, $event);
  }

  onDragleave($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragLeave = true;

    this._publish(flags, values, $event);
  }

  onDragover($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragOver = true;

    this._publish(flags, values, $event);
  }

  onDrop($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDrop = true;

    this._publish(flags, values, $event);
  }

  private _getFilterContent($event: DragEvent): FilterContent {
    const filter = new DragMetaFilter();
    filter.init($event);
    const flags: IDragFlags = filter.flags;
    const values: IDragValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: IDragFlags,
    $values: IDragValues,
    $event: DragEvent
  ): void {
    this.notifier.update({
      flags: $flags,
      values: $values,
      eventType: EVENT_TYPE.DRAG,
      defaultEvent: $event,
    });
  }
}
