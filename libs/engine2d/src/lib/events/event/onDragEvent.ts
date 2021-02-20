import type { EventNotifier } from '../../notifiers/eventNotifier';
import type { DragFlags, DragValues } from '../meta-filters/dragMetaFilter';
import { DragMetaFilter } from '../meta-filters/dragMetaFilter';
import { Event } from './event';

interface FilterContent {
  flags: DragFlags;
  values: DragValues;
  filter: DragMetaFilter;
}

export class OnDragEvent extends Event {
  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onDrag($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDrag = true;

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragend($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragEnd = true;

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragenter($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragEnter = true;

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragstart($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragStart = true;

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragleave($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragLeave = true;

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDragover($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDragOver = true;

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'drag',
      default: $event,
    });
  }

  onDrop($event: DragEvent): void {
    const { flags, values } = this._getFilterContent($event);

    flags.isDrop = true;

    this.eventNotifier.update({
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
