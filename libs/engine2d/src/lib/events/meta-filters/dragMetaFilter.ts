import { MetaFilter } from './metaFilter';

export interface IDragFlags {
  isDrag: boolean;
  isDragEnd: boolean;
  isDragEnter: boolean;
  isDragStart: boolean;
  isDragLeave: boolean;
  isDragOver: boolean;
  isDrop: boolean;
}

export interface IDragValues {
  data: DataTransfer;
}

export class DragMetaFilter extends MetaFilter<IDragFlags, IDragValues> {
  constructor() {
    super();
  }

  protected generateFlags(): IDragFlags {
    // will be changed at onDragEvent
    return {
      isDrag: false,
      isDragEnd: false,
      isDragEnter: false,
      isDragStart: false,
      isDragLeave: false,
      isDragOver: false,
      isDrop: false,
    };
  }

  protected generateValues($event: DragEvent): IDragValues {
    return {
      data: $event.dataTransfer || null,
    };
  }
}
