import type { Notifier } from '../../notifiers/notifier';
import type {
  PointerValues,
  PointerFlags,
} from '../meta-filters/pointerMetaFilter';
import type { FilterResult } from './event';
import { PointerMetaFilter } from '../meta-filters/pointerMetaFilter';
import { Event } from './event';
import { removeItem, getCenterCoord } from '@seek-psd/utils';
import { getButtonValue } from '../meta-filters/utils';
import { BUTTON_NAME, EVENT_TYPE, IDLE_INTERVAL } from '../../constants/index';

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

  constructor($notifier: Notifier<FilterResult>) {
    super($notifier);
  }

  onPointerdown($event: PointerEvent): void {
    const filterContent: FilterContent = this._getFilterContent($event);

    // set current button value
    this.prevButton = getButtonValue($event.button);

    // set a current filter for later-use
    this.ongoingTouches.push(filterContent.filter);

    // manage a multi-touch event
    const set: {
      flags: PointerFlags;
      values: PointerValues;
    } = this._manageMultiTouch(filterContent.flags, filterContent.values);
    const flags = set.flags;
    const values = set.values;

    // notify to the eventManager
    this._publish(flags, values, $event);
  }

  onPointerup($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);

    // reset current button value
    this.prevButton = '';

    // always remove an item from the list
    const currentId: number = values.meta.pointerId;
    this.ongoingTouches = this._removeFilterFromList(currentId);

    // notify to the eventManager
    this._publish(flags, values, $event);
  }

  onPointermove($event: PointerEvent): void {
    const filterContent: FilterContent = this._getFilterContent($event);

    // set move flag
    let flags: PointerFlags = this._setMoveFlag(filterContent.flags);
    let values: PointerValues = filterContent.values;

    // manage temorary client coords
    // use case is when we want to get pointer coords stopped for certain mili secs
    this._setTmpClient(values);

    // manage a multi-touch event
    const set: {
      flags: PointerFlags;
      values: PointerValues;
    } = this._manageMultiTouch(flags, values);
    flags = set.flags;
    values = set.values;

    // notify to the eventManager
    this._publish(flags, values, $event);
  }

  onPointerover($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);
    this._publish(flags, values, $event);
  }

  onPointerenter($event: PointerEvent): void {
    // set current button value
    this.prevButton = getButtonValue($event.button);

    //const { flags, values } = this._getFilterContent($event);
    //this._publish(flags, values, $event);
  }

  onPointercancel($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);
    this._publish(flags, values, $event);
  }

  onPointerout($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);
    this._publish(flags, values, $event);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPointerleave($event: PointerEvent): void {
    this.prevButton = '';

    //const { flags, values } = this._getFilterContent($event);
    //this._publish(flags, values, $event);
  }

  private _getFilterContent($event: PointerEvent): FilterContent {
    const filter = new PointerMetaFilter();
    filter.init($event);
    const flags: PointerFlags = filter.flags;
    const values: PointerValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: PointerFlags,
    $values: PointerValues,
    $event: PointerEvent
  ): void {
    this.notifier.update({
      flags: $flags,
      values: $values,
      eventType: EVENT_TYPE.POINTER,
      default: $event,
    });
  }

  private _setMoveFlag($flags: PointerFlags): PointerFlags {
    const flags: PointerFlags = Object.assign({}, $flags);

    switch (this.prevButton) {
      case BUTTON_NAME.LEFT:
        flags.state.isLeftMove = true;
        break;

      case BUTTON_NAME.MIDDLE:
        flags.state.isMiddleMove = true;
        break;

      case BUTTON_NAME.RIGHT:
        flags.state.isRightMove = true;
        break;

      case BUTTON_NAME.BACK:
        flags.state.isBackMove = true;
        break;

      case BUTTON_NAME.FORWARD:
        flags.state.isForwardMove = true;
        break;
    }

    return flags;
  }

  private _setTmpClient($values: PointerValues): void {
    if (this.idleTimer) clearInterval(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      $values.tmpClient.x = $values.client.x;
      $values.tmpClient.y = $values.client.y;
    }, IDLE_INTERVAL);
  }

  private _manageMultiTouch(
    $flags: PointerFlags,
    $values: PointerValues
  ): { flags: PointerFlags; values: PointerValues } {
    const flags: PointerFlags = Object.assign({}, $flags);
    const values: PointerValues = Object.assign({}, $values);

    const isMultiTouch: boolean = this.ongoingTouches.length > 1;
    flags.meta.isMultiTouch = isMultiTouch;

    if (!isMultiTouch) return { flags, values };

    const touchCount: number = this.ongoingTouches.length;
    const currentFilter: PointerMetaFilter = this.ongoingTouches[
      touchCount - 1
    ];
    const prevFilter: PointerMetaFilter = this.ongoingTouches[touchCount - 2];

    // calcurate center coordinates if it's multi-touch
    values.touch = getCenterCoord(
      currentFilter.values.client,
      prevFilter.values.client
    );

    return { flags, values };
  }

  private _removeFilterFromList($id: number): PointerMetaFilter[] {
    const index: number = this._getFilterIndexFromList($id);
    return removeItem(this.ongoingTouches, index);
  }

  private _getFilterIndexFromList($id: number): number {
    return this.ongoingTouches.findIndex(
      (e) => $id === e.values.meta.pointerId
    );
  }
}
