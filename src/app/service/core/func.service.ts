import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { MemoryService } from './memory.service';
import { GpuService } from './gpu.service';

// Module
import { ColorPickerService } from '../module/color-picker.service';
import { CropService } from '../module/crop.service';
import { ZoomService } from '../module/zoom.service';

// Model
import { Crop } from '../../model/crop.model';

@Injectable({
	providedIn: 'root'
})
export class FuncService {
	constructor(
		private memory: MemoryService,
		private gpu: GpuService,
		private colorPickerFunc: ColorPickerService,
		private cropFunc: CropService,
		private zoomFunc: ZoomService
	) {}

	///////////////////////////////////////////////////////////////////////////
	//j
	//	Color picker
	//
	///////////////////////////////////////////////////////////////////////////

	activateColorPicker(): void {
		this.colorPickerFunc.activate();
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Crop
	//
	///////////////////////////////////////////////////////////////////////////

	activateCrop(): void {
		this.cropFunc.activate();
	}

	crop(): void {
		this.cropFunc.getImage();
	}

	validateCropInput($crop: Crop): void {
		this.cropFunc.validateInput($crop);
	}

	toggleCropFixedResolution(): void {
		this.cropFunc.toggleFixedResolution();
	}

	rotateCropResolution(): void {
		this.cropFunc.rotateResolution();
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	zoom
	//
	///////////////////////////////////////////////////////////////////////////

	activateZoom(): void {
		this.zoomFunc.activate();
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Grayscale
	//
	///////////////////////////////////////////////////////////////////////////

	grayscale(): void {
		const flg: boolean = this.memory.isGrayscale$.getValue();
		this.memory.updateIsGrayScale(!flg);
		this.gpu.render();
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Flip
	//
	///////////////////////////////////////////////////////////////////////////

	flip(): void {
		const flg: boolean = this.memory.isFlip$.getValue();
		this.memory.updateIsFlip(!flg);
		this.gpu.render();
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Resize canvas
	//
	///////////////////////////////////////////////////////////////////////////

	resizeCanvas(): void {
		const type: number = this.memory.resizeCanvas$.getValue().type;
		const ratio: number = this.memory.resizeCanvas$.getValue().ratio;
		this.memory.updateResizeCanvas(type, ratio);

		this.memory.updateReservedByFunc({
			name: 'resize-canvas',
			type: '',
			group: ''
		});
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Download
	//
	///////////////////////////////////////////////////////////////////////////

	download(): void {
		const c: HTMLCanvasElement = this.gpu.rawPsdCanvas;

		c.toBlob(($blob: Blob) => {
			const fName: string = this.memory.fileName$.getValue().split('.')[0];
			saveAs($blob, fName);
		}, 'image/png');
	}

	private _grayscale($ctx: CanvasRenderingContext2D, $w: number, $h: number): void {
		const pixels: ImageData = $ctx.getImageData(0, 0, $w, $h);
		for (let y = 0; y < pixels.height; y++) {
			for (let x = 0; x < pixels.width; x++) {
				const i: number = y * 4 * pixels.width + x * 4;
				const rgb = Number((pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3);
				pixels.data[i] = rgb;
				pixels.data[i + 1] = rgb;
				pixels.data[i + 2] = rgb;
			}
		}

		$ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Garbage
	//
	///////////////////////////////////////////////////////////////////////////

	garbage(): void {
		this.memory.refreshData();

		// Initialize reservedByFuncs
		this.memory.updateReservedByFunc({
			name: '',
			type: '',
			group: ''
		});

		this.memory.renderer.element.dropArea.classList.add('active');

		setTimeout(() => {
			this.memory.renderer.element.container.style.maxWidth = '1200px';
			this.memory.renderer.element.psdViewer.style.maxHeight = '300px';
		}, 400);

		setTimeout(() => {
			// Initialize main canvas
			const c: HTMLCanvasElement = this.memory.renderer.element.main;
			c.width = 1;
			c.height = 1;
			const cBuffer: HTMLCanvasElement = this.memory.renderer.element.buffer;
			cBuffer.width = 1;
			cBuffer.height = 1;
		}, 1000);
	}
}
