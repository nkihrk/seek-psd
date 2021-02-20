import { MetaFilter } from './metaFilter';

export interface DragFlags {
  isDrag: boolean;
  isDragEnd: boolean;
  isDragEnter: boolean;
  isDragStart: boolean;
  isDragLeave: boolean;
  isDragOver: boolean;
  isDrop: boolean;
}

export interface DragValues {
  data: DataTransfer;
}

export class DragMetaFilter extends MetaFilter<DragFlags, DragValues> {
  constructor() {
    super();
  }

  protected generateFlags($event: DragEvent): DragFlags {
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

  protected generateValues($event: DragEvent): DragValues {
    return {
      data: $event.dataTransfer || null,
    };
  }
}
