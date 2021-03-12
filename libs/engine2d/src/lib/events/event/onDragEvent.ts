import type { Notifier } from '../../notifiers/notifier';
import type { IDragFlags, IDragValues } from '../meta-filters/dragMetaFilter';
import type { IEventOptions } from './event';
import { DragMetaFilter } from '../meta-filters/dragMetaFilter';
import { Event } from './event';

import { EVENT_TYPE } from '../../constants';

interface IFilterContent {
  flags: IDragFlags;
  values: IDragValues;
  filter: DragMetaFilter;
}

export class OnDragEvent extends Event {
  constructor($eventOptions: IEventOptions) {
    super($eventOptions);
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

  private _getFilterContent($event: DragEvent): IFilterContent {
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
