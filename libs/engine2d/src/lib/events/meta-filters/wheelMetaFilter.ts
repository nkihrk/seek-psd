import { MetaFilter } from './metaFilter';

export interface IWheelFlags {
  isWheelStart: boolean;
}

export interface IWheelValues {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
}

export class WheelMetaFilter extends MetaFilter<IWheelFlags, IWheelValues> {
  constructor() {
    super();
  }

  protected generateFlags(): IWheelFlags {
    return { isWheelStart: false };
  }

  protected generateValues($event: WheelEvent): IWheelValues {
    const values: IWheelValues = {
      deltaX: $event.deltaX,
      deltaY: $event.deltaY,
      deltaZ: $event.deltaZ,
    };

    return values;
  }
}
