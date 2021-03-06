/* eslint @typescript-eslint/no-explicit-any: 0 */

import { IStore, IFiles, IDragFlags, EVENT_TYPE } from '@seek-psd/engine2d';
import { Plugin } from '@seek-psd/engine2d';
import { hasProperty } from '@seek-psd/utils';
import { validateFormat, removePathFromName } from '@seek-psd/utils';
import * as JSZip from 'jszip';
import { fromBlob, FileTypeResult } from 'file-type/browser';

export const ZIP_LOADER = 'zipLoader';

const VALID_ZIP = '.(zip)$';

export class ZipLoader extends Plugin<any> {
  private totalCount = 0;
  private count = 0;

  constructor() {
    super({
      pluginType: EVENT_TYPE.DRAG,
    });
  }

  async call($store: IStore, $userStore: any): Promise<void> {
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
      this._loadZips(values.files);
    }
  }

  private _loadZips($files: File[]): void {
    const zips: File[] = $files.filter((f) => validateFormat(f, VALID_ZIP));

    console.log('Zip files : ', zips);

    this.totalCount = zips.length;
    this.count = 0;

    if (zips.length === 0) {
      console.log('There are no zip files. Skip loading files.');

      return this.resolve();
    }

    for (let i = 0; i < zips.length; i++) {
      const zip: File = zips[i];

      this._loadZip(zip);
    }
  }

  private _loadZip($file: File): void {
    if (validateFormat($file, VALID_ZIP)) {
      // remove a count from totalCount for zip
      this.totalCount--;

      this._zipReader($file);
    } else {
      this._storeFile($file);

      this._manageSuccess();
    }
  }

  private _storeFile($file: File): void {
    this.store.values.drag.files.push($file);
  }

  private async _zipReader($file: File): Promise<void> {
    try {
      const zip: JSZip = new JSZip();
      const zipData: JSZip = await zip.loadAsync($file);

      console.log('Files in zip : ', zipData.files);

      // add totalCount
      this.totalCount += Object.keys(zipData.files).length;

      for (const fileName in zipData.files) {
        if (hasProperty(zipData.files, fileName)) {
          try {
            // skip parsing if the target is directory
            if (zipData.files[fileName].dir) {
              console.log('Directory is detected. Skip loading the file.');

              this._manageError();

              continue;
            }

            const blob: Blob = await zipData.file(fileName).async('blob');
            const name: string = removePathFromName(fileName); // e.g. '/***/*.png' -> '*.png'
            const type: FileTypeResult = await fromBlob(blob);

            if (!type) {
              console.log(
                'Error loading mime type from a file. Skip loading the file.'
              );

              this._manageError();
              console.log(this.totalCount, this.count);

              continue;
            }

            const newFile: File = new File([blob], name, {
              type: type.mime,
            });

            console.log(name, type);

            this._loadZip(newFile);
          } catch (e) {
            console.error(e);

            this._manageError();
          }
        }
      }
    } catch (e) {
      console.error(e);

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
}
