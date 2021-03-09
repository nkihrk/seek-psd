/* eslint @typescript-eslint/no-explicit-any: 0 */

import type { IPlugin, IStore, IDragFlags, IFiles } from '@seek-psd/engine2d';
import { hasProperty } from '@seek-psd/utils';

export class FileLoader implements IPlugin<any> {
  private store: IStore = null;
  private userStore: any = null;

  constructor() {}

  async call($store: IStore, $userStore: any): Promise<void> {
    return new Promise((resolve: () => void) => {
      this.store = $store;
      this.userStore = $userStore;

      // cancel system events
      this.store.defaultEvent.preventDefault();
      this.store.defaultEvent.stopPropagation();

      // switch between eventTypes
      this._switchEventType(resolve);
    });
  }

  private _switchEventType($resolve: () => void): void {
    const flags: IDragFlags = this.store.flags.drag;
    const values: IFiles = this.store.values.drag;

    if (flags.isDrop) {
      this._extractData(values.data, $resolve);
    }
  }

  private async _extractData(
    $data: DataTransfer,
    $resolve: () => void
  ): Promise<void> {
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
          console.log(files[0].name);
          $resolve();
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
