import { MetaFilter } from './metaFilter';

export interface IEventFlags {
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  isOnline: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEventValues {}

export class EventMetaFilter extends MetaFilter<IEventFlags, IEventValues> {
  constructor() {
    super();
  }

  protected generateFlags(): IEventFlags {
    return {
      isFullscreen: !!document.fullscreenElement,
      isFullscreenSupported: document.fullscreenEnabled,
      isOnline: navigator.onLine,
    };
  }

  protected generateValues(): IEventValues {
    return {};
  }
}
