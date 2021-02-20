import type { Notifier } from '../../notifiers/notifier';
import type { FilterResult } from './event';
import type { DragFlags, DragValues } from '../meta-filters/dragMetaFilter';
import { DragMetaFilter } from '../meta-filters/dragMetaFilter';
import { Event } from './event';

interface FilterContent {
  flags: DragFlags;
  values: DragValues;
  filter: DragMetaFilter;
}

export class OnDragEvent extends Event {
  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onDrag($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDrag = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragend($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragEnd = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragenter($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragEnter = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragstart($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragStart = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragleave($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragLeave = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragover($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragOver = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDrop($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDrop = true;

    this.notifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  private _getFilterContent($event: DragEvent): FilterContent {
    const filter = new DragMetaFilter();
    filter.init($event);
    const flags: DragFlags = filter.flags;
    const values: DragValues = filter.values;

    return { flags, values, filter };
  }
}
