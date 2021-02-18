import { MetaFilter } from './metaFilter';

export interface ClipboardFlags {}

export interface ClipboardValues {}

export class ClipboardMetaFilter extends MetaFilter<
  ClipboardFlags,
  ClipboardValues
> {
  constructor() {
    super();
  }

  protected generateFlags($event: ClipboardEvent): ClipboardFlags {
    return undefined;
  }

  protected generateValues($event: ClipboardEvent): ClipboardValues {
    return undefined;
  }
}
