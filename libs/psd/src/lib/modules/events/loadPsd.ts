import type { IPlugin, IStore, IDragFlags, IFiles } from '@seek-psd/engine2d';
import type { IUserStore } from '../../store';
import type { Psd } from 'ag-psd';
import { readPsd } from 'ag-psd';
import { createImage, validateFormat } from '@seek-psd/utils';

export class LoadPsd implements IPlugin<IUserStore> {
  private store: IStore = null;
  private userStore: IUserStore = null;

  constructor() {}

  call($store: IStore, $userStore: IUserStore): void {
    this.store = Object.assign({}, $store);
    this.userStore = Object.assign({}, $userStore);

    // cancel system events
    this.store.defaultEvent.preventDefault();
    this.store.defaultEvent.stopPropagation();

    // switch between eventTypes
    this._switchEventType();
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
      this._checkFiles($files[i]);
    }
  }

  private _checkFiles($file: File): void {
    if (validateFormat($file.name, 'jpe?g|png|bmp')) {
      console.log('Image!');
    } else if (validateFormat($file.name, 'psd')) {
      console.log('PSD!');
    } else {
      throw new Error('Invalid file format is detected.');
    }
  }
}
