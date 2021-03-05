import type { Plugin, StoreManager } from '@seek-psd/engine2d';
import type {
  DragFlags,
  DragValues,
} from 'libs/engine2d/src/lib/events/meta-filters/dragMetaFilter';
import type { Store } from '../../store';
import { hasProperty } from '@seek-psd/utils';

export class FileLoader implements Plugin {
  private store: StoreManager = null;

  constructor() {}

  call($store: StoreManager & Store): void {
    this.store = $store;

    // cancel the system event
    this.store.defaultEvent.preventDefault();
    this.store.defaultEvent.stopPropagation();

    // switch between eventTypes
    this._switchEventType();
  }

  private _switchEventType(): void {
    const flags: DragFlags = this.store.dragFlags;
    const values: DragValues = this.store.dragValues;

    if (flags.isDrop) {
      this._extractData(values.data);
    }
  }

  private async _extractData($data: DataTransfer): Promise<void> {
    const items: DataTransferItemList = $data.items;
    const results: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
    const promises: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
    const files: File[] = [];

    for (const i in items) {
      if (hasProperty(items, i)) {
        const entry = items[i].webkitGetAsEntry();
        promises.push(this._scanFiles(entry, results));
      }
    }

    await Promise.all(promises);

    let count = 0;
    for (const result of results) {
      result.file((file: File) => {
        files.push(file);

        count++;
        if (count === results.length && files.length > 0) {
          this.onFileDropped(files);
        }
      });
    }
  }

  // https://qiita.com/wannabe/items/2b2f59a626313a8f58d4
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  onFileDropped($files: File[]): void {
    for (let i = 0; i < $files.length; i++) {
      this._checkFiles($files[i]);
      break;
    }
  }

  private _checkFiles($file: File): void {
    console.log($file);
  }
}
