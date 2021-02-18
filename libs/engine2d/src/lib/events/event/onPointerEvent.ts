import type { EventNotifier } from '../../notifiers/eventNotifier';
import type {
  PointerValues,
  PointerFlags,
} from '../meta-filters/pointerMetaFilter';
import { PointerMetaFilter } from '../meta-filters/pointerMetaFilter';
import { Event } from './event';
import { removeItem, getCenterCoord } from '@seek-psd/utils';

type FilterContent = {
  flags: PointerFlags;
  values: PointerValues;
  filter: PointerMetaFilter;
};

export class OnPointerEvent extends Event {
  private ongoingTouches: PointerMetaFilter[] = [];

  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onPointerdown($event: PointerEvent): void {
    const { flags, values, filter } = this._getFilterContent($event);

    // set a current filter for later-use
    this.ongoingTouches.push(filter);

    // manage a multi-touch event
    this._manageMultiTouch(flags, values);

    // notify to the eventManager
    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPointerup($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    // always remove an item from the list
    const currentId: number = values.meta.id;
    this._removeFilterFromList(currentId);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPointermove($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    // manage a multi-touch event
    this._manageMultiTouch(flags, values);

    // notify to the eventManager
    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPointerover($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPointerenter($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPointercancel($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPointerout($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  onPointerleave($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({ flags, values, default: $event });
  }

  private _getFilterContent($event: PointerEvent): FilterContent {
    const filter = new PointerMetaFilter();
    filter.init($event);
    const flags: PointerFlags = filter.flags;
    const values: PointerValues = filter.values;

    return { flags, values, filter };
  }

  private _manageMultiTouch(
    $flags: PointerFlags,
    $values: PointerValues
  ): void {
    const isMultiTouch: boolean = this.ongoingTouches.length > 1;
    $flags.meta.isMultiTouch = isMultiTouch;

    if (!isMultiTouch) return;

    const touchCount: number = this.ongoingTouches.length;
    const currentFilter: PointerMetaFilter = this.ongoingTouches[
      touchCount - 1
    ];
    const prevFilter: PointerMetaFilter = this.ongoingTouches[touchCount - 2];

    // calcurate center coordinates if it's multi-touch
    $values.touch = getCenterCoord(
      currentFilter.values.client,
      prevFilter.values.client
    );
  }

  private _removeFilterFromList($id: number): void {
    const index: number = this._getFilterIndexFromList($id);
    this.ongoingTouches = removeItem(this.ongoingTouches, index);
  }

  private _getFilterIndexFromList($id: number): number {
    return this.ongoingTouches.findIndex((e) => $id === e.values.meta.id);
  }
}
