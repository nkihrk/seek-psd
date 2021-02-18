import { MetaFilter } from './metaFilter';

export interface EventFlags {
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  isOnline: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventValues {}

export class EventMetaFilter extends MetaFilter<EventFlags, EventValues> {
  constructor() {
    super();
  }

  protected generateFlags(): EventFlags {
    return {
      isFullscreen: !!document.fullscreenElement,
      isFullscreenSupported: document.fullscreenEnabled,
      isOnline: navigator.onLine,
    };
  }

  protected generateValues(): EventValues {
    return {};
  }
}
