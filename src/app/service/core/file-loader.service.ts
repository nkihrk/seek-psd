import { Injectable } from '@angular/core';
import { Psd, readPsd } from 'ag-psd';
import { MemoryService } from '../../service/core/memory.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FileLoaderService {
	constructor(private memory: MemoryService) {}

	onFileDropped($fileList: File[]): void {
		if (this.memory.layerInfos$.getValue().length > 0) return;

		for (let i = 0; i < $fileList.length; i++) {
			this.checkFiles($fileList[i]);
		}
	}

	loadFile(): void {
		const input: HTMLInputElement = document.createElement('input');
		input.type = 'file';
		input.onchange = ($e: any) => {
			const files: FileList = $e.target.files;
			const fileList: any[] = [];
			for (const i in files) {
				if (files.hasOwnProperty(i)) {
					fileList.push(files[i]);
				}
			}

			this.onFileDropped(fileList);
		};

		input.click();
	}

	private checkFiles($file: File): void {
		if (this._isPsdFormat($file.name)) {
			this.fileReader($file);
		} else {
			console.log('Unknown file is detected.');
		}
	}

	private _isPsdFormat($fileName): boolean {
		return /\.(psd)$/i.test($fileName);
	}

	private async fileReader($file: File): Promise<any> {
		try {
			const arrayBuffer: ArrayBuffer = await this._readAsArrayBuffer($file);
			const fName: string = $file.name;
			const fType: string = fName.split('.').slice(-1).pop().toLowerCase();

			this._switchSubReaders($file, arrayBuffer, fName, fType);
		} catch ($e) {
			console.log($e);
		}
	}

	private _readAsArrayBuffer($f: File): Promise<any> {
		// https://simon-schraeder.de/posts/filereader-async/
		// https://blog.bitsrc.io/keep-your-promises-in-typescript-using-async-await-7bdc57041308

		// Return promise for fileReader
		return new Promise<string | ArrayBuffer>((resolve, reject) => {
			const reader: FileReader = new FileReader();
			reader.onload = ($e: any) => {
				resolve($e.target.result);
			};
			reader.onerror = reject;
			reader.readAsArrayBuffer($f);
		});
	}

	private async _switchSubReaders($f: File, $arrayBuffer: ArrayBuffer, $fName: string, $fType: string): Promise<any> {
		if ($fType === 'psd') {
			this._psdReader($arrayBuffer, $fName);
		}
	}

	private _psdReader($arrayBuffer: ArrayBuffer, $fileName: string): void {
		const psd: Psd = readPsd($arrayBuffer);

		this.memory.psdData$.next({ psd, fileName: $fileName });
	}
}
