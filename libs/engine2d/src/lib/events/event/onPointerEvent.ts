import type { EventNotifier } from '../../notifiers/eventNotifier';
import type {
  PointerValues,
  PointerFlags,
} from '../meta-filters/pointerMetaFilter';
import { PointerMetaFilter } from '../meta-filters/pointerMetaFilter';
import { Event } from './event';
import { removeItem, getCenterCoord } from '@seek-psd/utils';
import { getButtonValue } from '../meta-filters/utils';

interface FilterContent {
  flags: PointerFlags;
  values: PointerValues;
  filter: PointerMetaFilter;
}

export class OnPointerEvent extends Event {
  private prevButton = '';
  private ongoingTouches: PointerMetaFilter[] = [];
  // Detect idling of pointer events
  private idleTimer: number;
  private idleInterval = 1;

  constructor($eventNotifier: EventNotifier) {
    super($eventNotifier);
  }

  onPointerdown($event: PointerEvent): void {
    const { flags, values, filter } = this._getFilterContent($event);

    // set current button value
    this.prevButton = getButtonValue($event.button);

    // set a current filter for later-use
    this.ongoingTouches.push(filter);

    // manage a multi-touch event
    this._manageMultiTouch(flags, values);

    // notify to the eventManager
    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  onPointerup($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    // set current button value
    this.prevButton = getButtonValue($event.button);

    // always remove an item from the list
    const currentId: number = values.meta.id;
    this._removeFilterFromList(currentId);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  onPointermove($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    // set move flag
    this._setMoveFlag(flags);

    // manage temorary client coords
    // use case is when we want to get pointer coords stopped for certain mili secs
    this._setTmpClient(values);

    // manage a multi-touch event
    this._manageMultiTouch(flags, values);

    // notify to the eventManager
    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  onPointerover($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  onPointerenter($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  onPointercancel($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  onPointerout($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  onPointerleave($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    this.eventNotifier.update({
      flags,
      values,
      eventType: 'pointer',
      default: $event,
    });
  }

  private _getFilterContent($event: PointerEvent): FilterContent {
    const filter = new PointerMetaFilter();
    filter.init($event);
    const flags: PointerFlags = filter.flags;
    const values: PointerValues = filter.values;

    return { flags, values, filter };
  }

  private _setMoveFlag($flags: PointerFlags): void {
    switch (this.prevButton) {
      case 'left':
        $flags.state.isLeftMove = true;
        break;

      case 'middle':
        $flags.state.isMiddleMove = true;
        break;

      case 'right':
        $flags.state.isRightMove = true;
        break;

      case 'back':
        $flags.state.isBackMove = true;
        break;

      case 'forward':
        $flags.state.isForwardMove = true;
        break;
    }
  }

  private _setTmpClient($values: PointerValues): void {
    if (this.idleTimer) clearInterval(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      $values.tmpClient.x = $values.client.x;
      $values.tmpClient.y = $values.client.y;
    }, this.idleInterval);
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
