import type { PointerMetaFilter } from './events/meta-filters/pointerMetaFilter';

export interface IEventStore {
  pointer: IEventStorePointer;
}

export interface IEventStorePointer {
  prevButton: string;
  ongoingTouches: PointerMetaFilter[];
  idleTimer: number;
  isDown: boolean;
}

export class EventStore implements IEventStore {
  pointer: IEventStorePointer = {
    prevButton: '',
    ongoingTouches: [],
    // detect idling of pointer events
    idleTimer: null,
    // to set isDownMove flag
    isDown: false,
  };

  constructor() {}
}
