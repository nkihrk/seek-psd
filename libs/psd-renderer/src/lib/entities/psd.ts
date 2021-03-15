import type { ICoord, IStore } from '@seek-psd/engine2d';
import type { ILayerInfo } from './layerInfo';

export interface IPsd extends IPsdMeta, IPsdUtils {}

export interface IPsdMeta {
  readonly fileName: string;
  readonly uniqueId: string;
  readonly rawWidth: number;
  readonly rawHeight: number;
  readonly rawElement: HTMLCanvasElement;
  readonly layerInfos: ILayerInfo[];
}

export interface IPsdUtils {
  history: IPsdHistory;
  doCommand($commandType: string, $store: IStore): void;
  undo(): void;
  redo(): void;
}

export interface IPsdHistory {
  current: IPsdState;
  commands: any[];
  position: number;
}

export interface IPsdState {
  element: HTMLCanvasElement;
  width: number;
  height: number;
  offset: {
    prev: ICoord;
    new: ICoord;
  };
  rotation: number;
  isFlip: boolean;
  isGrayScale: boolean;
}

// update size
const createUpdateSizeCommand = ($store: IStore, $psd: IPsd) => {
  const current: IPsdState = $psd.history.current;
  const prevWidth: number = current.width;
  const prevHeight: number = current.height;

  return {
    execute(): void {
      const diffOffset: ICoord = $store.values.pointer.diff;
      current.width += diffOffset.x;
      current.height += diffOffset.y;
    },
    undo(): void {
      current.width = prevWidth;
      current.height = prevHeight;
    },
  };
};

// update offset
const createUpdateOffsetCommand = ($store: IStore, $psd: IPsd) => {
  const offset: { prev: ICoord; new: ICoord } = $psd.history.current.offset;
  const prevX: number = offset.new.x;
  const prevY: number = offset.new.y;

  return {
    execute(): void {
      const diffOffset: ICoord = $store.values.pointer.diff;
      offset.new.x = offset.prev.x + diffOffset.x;
      offset.new.y = offset.prev.y + diffOffset.y;
    },
    undo(): void {
      offset.new.x = prevX;
      offset.new.y = prevY;
    },
  };
};

export enum PSD_COMMAND {
  UPDATE_SIZE = 'UPDATE_SIZE',
  UPDATE_OFFSET = 'UPDATE_OFFSET',
  UPDATE_ROTATION = 'UPDATE_ROTATION',
  UPDATE_FLIP = 'UPDATE_FLIP',
  UPDATE_GRAYSCALE = 'UPDATE_GRAYSCALE',
}

const commands = {
  [PSD_COMMAND.UPDATE_SIZE]: createUpdateSizeCommand,
  [PSD_COMMAND.UPDATE_OFFSET]: createUpdateOffsetCommand,
  [PSD_COMMAND.UPDATE_ROTATION]: () => {},
  [PSD_COMMAND.UPDATE_FLIP]: () => {},
  [PSD_COMMAND.UPDATE_GRAYSCALE]: () => {},
};

interface TCommand {
  [$command: string]: (
    $store: IStore,
    $psd: IPsd
  ) => { execute: () => void; undo: () => void };
}

export class Psd implements IPsd {
  readonly fileName: string;
  readonly uniqueId: string;
  readonly rawWidth: number;
  readonly rawHeight: number;
  readonly rawElement: HTMLCanvasElement;
  readonly layerInfos: ILayerInfo[] = [];
  history: IPsdHistory = {
    current: {
      element: document.createElement('canvas'),
      width: 0,
      height: 0,
      offset: {
        new: {
          x: 0,
          y: 0,
        },
        prev: {
          x: 0,
          y: 0,
        },
      },
      rotation: 0,
      isFlip: false,
      isGrayScale: false,
    },
    commands: [],
    position: 0,
  };

  constructor($psdMeta: IPsdMeta) {
    this.fileName = $psdMeta.fileName;
    this.uniqueId = $psdMeta.uniqueId;
    this.rawWidth = $psdMeta.rawWidth;
    this.rawHeight = $psdMeta.rawHeight;
    this.rawElement = $psdMeta.rawElement;
    this.layerInfos = $psdMeta.layerInfos;
  }

  // https://medium.com/fbbd/intro-to-writing-undo-redo-systems-in-javascript-af17148a852b
  doCommand($commandType: string, $store: IStore): void {
    const history: IPsdHistory = this.history;

    if (history.position < history.commands.length - 1) {
      history.commands = history.commands.slice(0, history.position + 1);
    }

    if (commands[$commandType]) {
      const concreteCommand = commands[$commandType]($store, this);
      history.commands.push(concreteCommand);
      history.position += 1;

      concreteCommand.execute();
    }
  }

  undo() {
    const history: IPsdHistory = this.history;

    if (history.position > 0) {
      history.commands[history.position].undo();
      history.position -= 1;
    }
  }

  redo() {
    const history: IPsdHistory = this.history;

    if (history.position < history.commands.length - 1) {
      history.position += 1;
      history.commands[history.position].execute();
    }
  }
}
