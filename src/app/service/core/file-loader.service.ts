import { Injectable } from '@angular/core';
import { Psd, readPsd } from 'ag-psd';
import { MemoryService } from '../../service/core/memory.service';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { ValidateFormatService } from '../util/validate-format.service';
import { LibService } from '../util/lib.service';

@Injectable({
	providedIn: 'root'
})
export class FileLoaderService {
	constructor(
		private memory: MemoryService,
		private notifier: NotifierService,
		private validateFormat: ValidateFormatService,
		private lib: LibService
	) {}

	onFileDropped($fileList: File[]): void {
		for (let i = 0; i < $fileList.length; i++) {
			this.checkFiles($fileList[i]);
		}
	}

	getFile(): Promise<File[]> {
		return new Promise((resolve: any) => {
			const input: HTMLInputElement = document.createElement('input');
			input.type = 'file';
			input.accept = '.jpeg, .jpg, .png, .bmp, .psd';
			input.onchange = ($e: any) => {
				const files: FileList = $e.target.files;
				const fileList: any[] = [];
				for (const i in files) {
					if (files.hasOwnProperty(i)) {
						fileList.push(files[i]);
					}
				}

				resolve(fileList);
			};

			input.click();
		});
	}

	private checkFiles($file: File): void {
		if (this.validateFormat.isValidImageFormatBlob($file.name)) {
			this.blobReader($file);
		} else if (this.validateFormat.isValidImageFormatFile($file.name)) {
			this.fileReader($file);
		} else {
			this.memory.updateIsLoading(false);
			this.notifier.notify('error', '未対応のファイルフォーマットです');
		}
	}

	private blobReader($file: File): void {
		const img: HTMLImageElement = this.lib.createImg($file, ($img: HTMLImageElement) => {
			const imgCanvas: HTMLCanvasElement = document.createElement('canvas');
			imgCanvas.width = $img.width;
			imgCanvas.height = $img.height;

			const ctx: CanvasRenderingContext2D = imgCanvas.getContext('2d');
			ctx.drawImage($img, 0, 0);

			const psd: Psd = {
				canvas: imgCanvas,
				children: [
					{
						canvas: imgCanvas,
						top: 0,
						bottom: imgCanvas.height,
						left: 0,
						right: imgCanvas.width,
						blendMode: 'normal',
						hidden: false,
						opacity: 1,
						clipping: false,
						name: $file.name
					}
				],
				width: imgCanvas.width,
				height: imgCanvas.height
			};
			this.memory.psdData$.next({ psd, fileName: $file.name });
		});
		img.onerror = ($e) => {
			this.memory.updateIsLoading(false);
			this.notifier.notify('error', 'ファイルの読み込みに失敗しました');
		};
	}

	private async fileReader($file: File): Promise<any> {
		const arrayBuffer: ArrayBuffer = await this._readAsArrayBuffer($file);
		const fName: string = $file.name;
		const fType: string = fName.split('.').slice(-1).pop().toLowerCase();

		this._switchSubReaders($file, arrayBuffer, fName, fType);
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

	private _switchSubReaders($f: File, $arrayBuffer: ArrayBuffer, $fName: string, $fType: string): void {
		if ($fType === 'psd') {
			this._psdReader($arrayBuffer, $fName);
		} else {
			this.memory.updateIsLoading(false);
			this.notifier.notify('error', '未対応のファイルフォーマットです');
		}
	}

	private _psdReader($arrayBuffer: ArrayBuffer, $fileName: string): void {
		try {
			const psd: Psd = readPsd($arrayBuffer);
			this.memory.psdData$.next({ psd, fileName: $fileName });
		} catch ($error) {
			this.memory.updateIsLoading(false);
			this.notifier.notify('error', 'ファイルの読み込みに失敗しました');
		}
	}
}
