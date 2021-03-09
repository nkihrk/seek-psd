import { MetaFilter } from './metaFilter';

export interface IClipboardFlags {
  isCut: boolean;
  isCopy: boolean;
  isPaste: boolean;
}

export interface IClipboardValues {
  data: DataTransfer;
}

export class ClipboardMetaFilter extends MetaFilter<
  IClipboardFlags,
  IClipboardValues
> {
  constructor() {
    super();
  }

  protected generateFlags(): IClipboardFlags {
    return {
      isCut: false, // will be changed at onClipboardEvent
      isCopy: false, // will be changed at onClipboardEvent
      isPaste: false, // will be changed at onClipboardEvent
    };
  }

  protected generateValues($event: ClipboardEvent): IClipboardValues {
    return {
      data: $event.clipboardData || null,
    };
  }
}
