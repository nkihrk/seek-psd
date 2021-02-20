import type { Coord } from './events/meta-filters/pointerMetaFilter';

export interface PointerOffset {
  current: Coord;
  prev: Coord;
  raw: Coord;
  tmp: Coord;
}
