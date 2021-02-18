import { MetaFilter } from './metaFilter';

export interface WheelFlags {
  isWheelStart: boolean;
}

export interface WheelValues {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

export class WheelMetaFilter extends MetaFilter<WheelFlags, WheelValues> {
  constructor() {
    super();
  }

  protected generateFlags(): WheelFlags {
    return { isWheelStart: false };
  }

  protected generateValues($event: WheelEvent): WheelValues {
    const values: WheelValues = {
      deltaX: $event.deltaX,
      deltaY: $event.deltaY,
      deltaZ: $event.deltaZ,
    };

    return values;
  }
}
