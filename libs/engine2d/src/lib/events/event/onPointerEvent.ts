import type { Notifier } from '../../notifiers/notifier';
import type {
  IPointerValues,
  IPointerFlags,
} from '../meta-filters/pointerMetaFilter';
import type { IEventOptions } from './event';
import type { IEventStore, IEventStorePointer } from '../../eventStore';
import { PointerMetaFilter } from '../meta-filters/pointerMetaFilter';
import { Event } from './event';
import { removeItem, getCenterCoord } from '@seek-psd/utils';
import { getButtonValue } from '../meta-filters/utils';
import { BUTTON_NAME, EVENT_TYPE, IDLE_INTERVAL } from '../../constants/index';

interface IFilterContent {
  flags: IPointerFlags;
  values: IPointerValues;
  filter: PointerMetaFilter;
}

export class OnPointerEvent extends Event {
  constructor($eventOptions: IEventOptions) {
    super($eventOptions);
  }

  onPointerdown($event: PointerEvent): void {
    const filterContent: IFilterContent = this._getFilterContent($event);
    const store: IEventStorePointer = this.eventStore.pointer;

    // set isDown flag
    store.isDown = true;

    // set current button value
    store.prevButton = getButtonValue($event.button);

    // set a current filter for later-use
    store.ongoingTouches.push(filterContent.filter);

    // manage a multi-touch event
    const set: {
      flags: IPointerFlags;
      values: IPointerValues;
    } = this._manageMultiTouch(filterContent.flags, filterContent.values);
    const flags = set.flags;
    const values = set.values;

    // notify to the eventManager
    this._publish(flags, values, $event);
  }

  onPointerup($event: PointerEvent): void {
    const { flags, values } = this._getFilterContent($event);
    const store: IEventStorePointer = this.eventStore.pointer;

    // reset isDown flag
    store.isDown = false;

    // reset current button value
    store.prevButton = '';

    // always remove an item from the list
    const currentId: number = values.meta.pointerId;
    store.ongoingTouches = this._removeFilterFromList(currentId);

    // notify to the eventManager
    this._publish(flags, values, $event);
  }

  onPointermove($event: PointerEvent): void {
    const filterContent: IFilterContent = this._getFilterContent($event);
    const store: IEventStorePointer = this.eventStore.pointer;

    // set move flag
    let flags: IPointerFlags = this._setMoveFlag(filterContent.flags);
    let values: IPointerValues = filterContent.values;

    // set isDownMove
    flags.base.isDownMove = store.isDown;

    // manage temorary client coords
    // use case is when we want to get pointer coords stopped for certain mili secs
    this._setTmpClient(values);

    // manage a multi-touch event
    const set: {
      flags: IPointerFlags;
      values: IPointerValues;
    } = this._manageMultiTouch(flags, values);
    flags = set.flags;
    values = set.values;

    // notify to the eventManager
    this._publish(flags, values, $event);
  }

  onPointerover($event: PointerEvent): void {}

  onPointerenter($event: PointerEvent): void {}

  onPointercancel($event: PointerEvent): void {}

  onPointerout($event: PointerEvent): void {}

  onPointerleave($event: PointerEvent): void {}

  private _getFilterContent($event: PointerEvent): IFilterContent {
    const filter = new PointerMetaFilter();
    filter.init($event);
    const flags: IPointerFlags = filter.flags;
    const values: IPointerValues = filter.values;

    return { flags, values, filter };
  }

  private _publish(
    $flags: IPointerFlags,
    $values: IPointerValues,
    $event: PointerEvent
  ): void {
    this.notifier.update({
      flags: $flags,
      values: $values,
      eventType: EVENT_TYPE.POINTER,
      defaultEvent: $event,
    });
  }

  private _setMoveFlag($flags: IPointerFlags): IPointerFlags {
    const flags: IPointerFlags = Object.assign({}, $flags);
    const store: IEventStorePointer = this.eventStore.pointer;

    switch (store.prevButton) {
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

  private _setTmpClient($values: IPointerValues): void {
    const store: IEventStorePointer = this.eventStore.pointer;

    if (store.idleTimer) clearInterval(store.idleTimer);
    // https://github.com/Microsoft/TypeScript/issues/30128#issuecomment-651877225
    store.idleTimer = window.setTimeout(() => {
      $values.tmpClient.x = $values.client.x;
      $values.tmpClient.y = $values.client.y;
    }, IDLE_INTERVAL);
  }

  private _manageMultiTouch(
    $flags: IPointerFlags,
    $values: IPointerValues
  ): { flags: IPointerFlags; values: IPointerValues } {
    const flags: IPointerFlags = Object.assign({}, $flags);
    const values: IPointerValues = Object.assign({}, $values);
    const store: IEventStorePointer = this.eventStore.pointer;

    const isMultiTouch: boolean = store.ongoingTouches.length > 1;
    flags.meta.isMultiTouch = isMultiTouch;

    if (!isMultiTouch) return { flags, values };

    const touchCount: number = store.ongoingTouches.length;
    const currentFilter: PointerMetaFilter =
      store.ongoingTouches[touchCount - 1];
    const prevFilter: PointerMetaFilter = store.ongoingTouches[touchCount - 2];

    // calcurate center coordinates if it's multi-touch
    values.touch = getCenterCoord(
      currentFilter.values.client,
      prevFilter.values.client
    );

    return { flags, values };
  }

  private _removeFilterFromList($id: number): PointerMetaFilter[] {
    const index: number = this._getFilterIndexFromList($id);
    return removeItem(this.eventStore.pointer.ongoingTouches, index);
  }

  private _getFilterIndexFromList($id: number): number {
    return this.eventStore.pointer.ongoingTouches.findIndex(
      (e) => $id === e.values.meta.pointerId
    );
  }
}
