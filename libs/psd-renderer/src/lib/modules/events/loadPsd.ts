import type { IStore, IDragFlags, IFiles } from '@seek-psd/engine2d';
import type { IPsdSet, IUserStore } from '../../store';
import { IPsdData, PsdData } from '../../entities/psdData';
import type { Psd } from 'ag-psd';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { readPsd } from 'ag-psd';
import { Plugin } from '@seek-psd/engine2d';
import { createImage, validateFormat } from '@seek-psd/utils';

export class LoadPsd extends Plugin<IUserStore> {
  private totalCount = 0;
  private count = 0;

  constructor() {
    // enable notifier
    super({
      pluginType: EVENT_TYPE.DRAG,
    });
  }

  async call($store: IStore, $userStore: IUserStore): Promise<void> {
    super.call($store, $userStore);

    return new Promise((resolve: () => void) => {
      // initialize
      this.resolve = resolve;
      this.totalCount = $store.values.drag.files.length;
      this.count = 0;

      // switch between eventTypes
      this._switchEventType();
    });
  }

  private _switchEventType(): void {
    const flags: IDragFlags = this.store.flags.drag;
    const values: IFiles = this.store.values.drag;

    if (flags.isDrop) {
      this._onFileDropped(values.files);
    }
  }

  private _onFileDropped($files: File[]): void {
    for (let i = 0; i < $files.length; i++) {
      const file: File = $files[i];

      if (validateFormat(file.name, 'jpe?g|png|bmp')) {
        this._blobReader(file);
      } else if (validateFormat(file.name, 'psd')) {
        this._fileReader(file);
      } else {
        throw new Error('Invalid file format is detected.');
      }
    }
  }

  private _blobReader($file: File): void {
    const img: HTMLImageElement = createImage(
      $file,
      ($img: HTMLImageElement) => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const rect: DOMRect = $img.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.drawImage($img, 0, 0);
        const psdSet: IPsdSet = {
          fileName: $file.name,
          psdData: new PsdData($file.name, canvas),
        };

        this.userStore.psdSets.push(psdSet);

        console.log($file.name);

        this.count++;
        if (this.count === this.totalCount) this.resolve();
      }
    );
    img.onerror = () => {
      throw new Error('Error loading an image.');
    };
  }

  private async _fileReader($file: File): Promise<void> {
    const arrayBuffer: ArrayBuffer = await this._readAsArrayBuffer($file);
    const fileName: string = $file.name;
    const fileType: string = fileName.split('.').slice(-1).pop().toLowerCase();

    this._switchSubReaders(fileName, fileType, arrayBuffer);
  }

  private _readAsArrayBuffer($file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result as ArrayBuffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer($file);
    });
  }

  private _switchSubReaders(
    $fileName: string,
    $fileType: string,
    $arrayBuffer: ArrayBuffer
  ): void {
    if ($fileType === 'psd') {
      this._psdReader($fileName, $arrayBuffer);
    } else {
      throw new Error('Invalid file format is detected.');
    }
  }

  private _psdReader($fileName: string, $arrayBuffer: ArrayBuffer): void {
    try {
      const psd: Psd = readPsd($arrayBuffer);
      const psdSet: IPsdSet = {
        fileName: $fileName,
        psdData: new PsdData($fileName, psd.canvas, psd),
      };

      this.userStore.psdSets.push(psdSet);

      console.log($fileName);

      this.count++;
      if (this.count === this.totalCount) this.resolve();
    } catch (e) {
      throw new Error('Error pasing a file.');
    }
  }
}
