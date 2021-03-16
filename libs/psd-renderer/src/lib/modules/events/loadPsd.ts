import type { IStore, IDragFlags, IFiles } from '@seek-psd/engine2d';
import type { IPsdSet, IUserStore } from '../../store';
import type { Psd } from 'ag-psd';
import {
  DummyPsdData,
  IDummyPsd,
  IPsdData,
  PsdData,
} from '../../entities/psdData';
import { EVENT_TYPE } from '@seek-psd/engine2d';
import { readPsd } from 'ag-psd';
import { Plugin } from '@seek-psd/engine2d';
import {
  createDecodedImage,
  validateFormat,
  getExtensionFromName,
} from '@seek-psd/utils';

export const LOAD_PSD = 'loadPsd';

const VALID_BLOB = '.(jpe?g|png|bmp)$';
const VALID_FILE = '.(psd|vnd.adobe.photoshop)$';
const VALID_PSD = '.(psd|vnd.adobe.photoshop)$';

export class LoadPsd extends Plugin<IUserStore> {
  private totalCount = 0;
  private count = 0;

  constructor() {
    super({
      pluginType: EVENT_TYPE.DRAG,
    });
  }

  async call($store: IStore, $userStore: IUserStore): Promise<void> {
    super.call($store, $userStore);

    return new Promise((resolve: () => void) => {
      this.resolve = resolve;

      // switch between eventTypes
      this._switchEventType();
    });
  }

  private _switchEventType(): void {
    const flags: IDragFlags = this.store.flags.drag;
    const values: IFiles = this.store.values.drag;

    if (flags.isDrop) {
      this._loadFiles(values.files);
      this._clearCaches();
    }
  }

  private _loadFiles($files: File[]): void {
    const files: File[] = $files.filter((f) => {
      return validateFormat(f, VALID_BLOB) || validateFormat(f, VALID_FILE);
    });

    console.log('PSD/Image files : ', files);

    // initialize counts
    this.totalCount = files.length;
    this.count = 0;

    if (files.length === 0) {
      console.log('There is no supported files.');
      this.resolve();
    }

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];

      console.log(file);

      if (validateFormat(file, VALID_BLOB)) {
        this._blobReader(file);
      } else if (validateFormat(file, VALID_FILE)) {
        this._fileReader(file);
      } else {
        console.log('Unknow file format is detected.');

        this._manageError();
      }
    }
  }

  private _blobReader($file: File): void {
    const image: HTMLImageElement = createDecodedImage(
      $file,
      (i) => this._updatePsdSets(i, $file.name),
      () => this._onDecodeError()
    );

    image.onerror = () => {
      console.error('Error loading an image.');

      this._manageError();
    };
  }

  private _updatePsdSets($image: HTMLImageElement, $fileName: string): void {
    const dummyPsd: IDummyPsd = {
      width: $image.width,
      height: $image.height,
      canvas: $image,
      children: [],
    };
    const psdSet: IPsdSet = {
      fileName: $fileName,
      psdData: new DummyPsdData($fileName, dummyPsd),
    };

    this.userStore.psdSets.push(psdSet);

    console.log($fileName);

    this._manageSuccess();
  }

  private _onDecodeError(): void {
    this._manageError();
  }

  private async _fileReader($file: File): Promise<void> {
    const arrayBuffer: ArrayBuffer = await this._readAsArrayBuffer($file);

    this._switchSubReaders($file, arrayBuffer);
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

  private _switchSubReaders($file: File, $arrayBuffer: ArrayBuffer): void {
    if (validateFormat($file, VALID_PSD)) {
      this._psdReader($file.name, $arrayBuffer);
    } else {
      console.error('Invalid file format is detected.');

      this._manageError();
    }
  }

  private _psdReader($fileName: string, $arrayBuffer: ArrayBuffer): void {
    try {
      const psd: Psd = readPsd($arrayBuffer);
      const psdSet: IPsdSet = {
        fileName: $fileName,
        psdData: new PsdData($fileName, psd),
      };

      this.userStore.psdSets.push(psdSet);

      console.log($fileName, psd);

      this._manageSuccess();
    } catch (e) {
      console.error('Error pasing a file.');

      this._manageError();
    }
  }

  private _manageSuccess(): void {
    this.count++;
    if (this.count === this.totalCount) this.resolve();
  }

  private _manageError(): void {
    this.totalCount--;
    if (this.count === this.totalCount) this.resolve();
  }

  private _clearCaches(): void {
    this.store.values.drag.files = [];
  }
}
