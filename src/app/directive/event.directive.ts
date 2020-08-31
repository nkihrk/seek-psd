import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
	selector: '[appEvent]'
})
export class EventDirective {
	@Output() fileDropped = new EventEmitter<File[]>();

	constructor() {}

	// Dragover listener
	@HostListener('dragover', ['$event']) onDragOver($e) {
		$e.preventDefault();
		$e.stopPropagation();
	}

	// Dragleave listener
	@HostListener('dragleave', ['$event']) onDragLeave($e) {
		$e.preventDefault();
		$e.stopPropagation();
	}

	// Drop listener
	@HostListener('drop', ['$event']) async onDrop($e: DragEvent) {
		$e.preventDefault();
		$e.stopPropagation();

		// https://qiita.com/wannabe/items/2b2f59a626313a8f58d4
		async function __scanFiles(entry: any, tmpObject: any) {
			switch (true) {
				case entry.isDirectory:
					const entryReader = entry.createReader();
					const entries: [] = await new Promise((resolve) => {
						entryReader.readEntries(($entries) => resolve($entries));
					});
					await Promise.all(entries.map(($entry) => __scanFiles($entry, tmpObject)));
					break;
				case entry.isFile:
					tmpObject.push(entry);
					break;
			}
		}

		const items: DataTransferItemList = $e.dataTransfer.items;
		const results: any[] = [];
		const promises: any[] = [];
		const fileList: File[] = [];

		for (const i in items) {
			if (items.hasOwnProperty(i)) {
				const entry = items[i].webkitGetAsEntry();
				promises.push(__scanFiles(entry, results));
			}
		}

		await Promise.all(promises);

		let count = 0;
		for (const result of results) {
			result.file((file: File) => {
				fileList.push(file);

				count++;
				if (count === results.length && fileList.length > 0) {
					this.fileDropped.emit(fileList);
				}
			});
		}
	}
}
