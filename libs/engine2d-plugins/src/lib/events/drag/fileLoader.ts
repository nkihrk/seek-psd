/* eslint @typescript-eslint/no-explicit-any: 0 */

import { IStore, IFiles, IDragFlags, EVENT_TYPE } from '@seek-psd/engine2d';
import { Plugin } from '@seek-psd/engine2d';
import { hasProperty } from '@seek-psd/utils';

export const FILE_LOADER = 'fileLoader';

export class FileLoader extends Plugin<any> {
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
      this._extractData(values.data);
    }
  }

  private async _extractData($data: DataTransfer): Promise<void> {
    let count = 0;
    const items: DataTransferItemList = $data.items;
    const results: any[] = [];
    const promises: any[] = [];
    const files: File[] = [];

    for (const i in items) {
      if (hasProperty(items, i)) {
        const entry = items[i].webkitGetAsEntry();
        promises.push(this._scanFiles(entry, results));
      }
    }

    await Promise.all(promises);

    for (const result of results) {
      result.file((file: File) => {
        files.push(file);

        count++;
        if (count === results.length && files.length > 0) {
          this.store.values.drag.files = files;

          console.log('File loaded : ', files);

          this.resolve();
        }
      });
    }
  }

  // https://qiita.com/wannabe/items/2b2f59a626313a8f58d4
  private async _scanFiles($entry: any, $tmpObject: any): Promise<void> {
    switch (true) {
      case $entry.isDirectory: {
        const entryReader = $entry.createReader();
        const entries: [] = await new Promise((resolve) => {
          entryReader.readEntries((e) => resolve(e));
        });
        await Promise.all(entries.map((e) => this._scanFiles(e, $tmpObject)));
        break;
      }

      case $entry.isFile: {
        $tmpObject.push($entry);
        break;
      }
    }
  }
}
