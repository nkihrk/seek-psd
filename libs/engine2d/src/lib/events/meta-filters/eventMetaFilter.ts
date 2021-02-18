import { MetaFilter } from './metaFilter';

export interface EventFlags {}

export interface EventValues {}

export class EventMetaFilter extends MetaFilter<EventFlags, EventValues> {
  constructor() {
    super();
  }

  protected generateFlags(): EventFlags {
    return undefined;
  }

  protected generateValues($event: Event): EventValues {
    return undefined;
  }
}
