import { MetaFilter } from './metaFilter';

export interface ClipboardFlags {
  isCut: boolean;
  isCopy: boolean;
  isPaste: boolean;
}

export interface ClipboardValues {
  data: DataTransfer;
}

export class ClipboardMetaFilter extends MetaFilter<
  ClipboardFlags,
  ClipboardValues
> {
  constructor() {
    super();
  }

  protected generateFlags(): ClipboardFlags {
    return {
      isCut: false, // will be changed at onClipboardEvent
      isCopy: false, // will be changed at onClipboardEvent
      isPaste: false, // will be changed at onClipboardEvent
    };
  }

  protected generateValues($event: ClipboardEvent): ClipboardValues {
    return {
      data: $event.clipboardData || null,
    };
  }
}
