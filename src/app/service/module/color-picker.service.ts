import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { NotifierService } from 'angular-notifier';
import { PointerOffset } from '../../model/pointer-offset.model';

@Injectable({
	providedIn: 'root'
})
export class ColorPickerService {
	private defaultSize = 220;
	private defaultRatio = 20;

	private gridColor = '#e9e7e6';
	private bgColor = '#fefcfb';
	private prevPixel = '333333';

	private prevOffsetX = this.defaultSize / 10 + 0.5;
	private prevOffsetY = this.defaultSize / 10 + 0.5;

	private isSpuitFlg = false;

	constructor(private memory: MemoryService, private notifier: NotifierService) {}

	activate(): void {
		this.memory.updateReservedByFunc({
			name: 'color-picker',
			type: '',
			group: ''
		});

		this.render();
	}

	getColor(): void {
		const pointerOffset: PointerOffset['raw'] = this.memory.pointerOffset.raw;
		const rendererOffset: DOMRect = this.memory.renderer.element.main.getBoundingClientRect();

		const diffW: number = pointerOffset.x - rendererOffset.x;
		const diffH: number = pointerOffset.y - rendererOffset.y;
		const rendererW: number = rendererOffset.width;
		const rendererH: number = rendererOffset.height;

		if (diffW < 0 || diffH < 0 || rendererW < diffW || rendererH < diffH) return;

		const ctx: CanvasRenderingContext2D = this.memory.renderer.element.main.getContext('2d');
		const rgb: Uint8ClampedArray = ctx.getImageData(diffW, diffH, 1, 1).data;

		let hex: string = this.rgbToHex(rgb[0], rgb[1], rgb[2]);
		hex = hex === '0' ? '000000' : hex;
		this.prevPixel = hex;
		// Update color state
		this.notifier.notify('success', `クリップボードにコピー : #${hex}`);
		// Copy hex to clipboard
		this.copyTextToClipboard(hex);
	}

	private rgbToHex($r: number, $g: number, $b: number): string {
		if ($r > 255 || $g > 255 || $b > 255) console.log('Failed to convert RGB into HEX : ', $r, $g, $b);
		return (($r << 16) | ($g << 8) | $b).toString(16);
	}

	private copyTextToClipboard($text: string) {
		const copyFrom = document.createElement('textarea');

		copyFrom.textContent = $text;

		const bodyElm = document.getElementsByTagName('body')[0];
		bodyElm.appendChild(copyFrom);

		copyFrom.select();
		const retVal = document.execCommand('copy');
		bodyElm.removeChild(copyFrom);
		return retVal;
	}

	render(): void {
		const c: HTMLCanvasElement = this.memory.renderer.element.ui;
		c.width = this.memory.renderer.element.uiCanvasWrapper.clientWidth;
		c.height = this.memory.renderer.element.uiCanvasWrapper.clientHeight;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		const size: number = this.defaultSize;
		const ratio: number = this.defaultRatio;
		const offset: number = size / 10;
		const pointerOffset: PointerOffset['raw'] = this.memory.pointerOffset.raw;

		// Main canvas coordinates
		const rendererOffset: DOMRect = this.memory.renderer.element.main.getBoundingClientRect();

		// Calculate appropriate position of lupe
		const clientWidth: number = this.memory.renderer.element.uiCanvasWrapper.clientWidth;
		const clientHeight: number = this.memory.renderer.element.uiCanvasWrapper.clientHeight;
		const isLargerX: boolean = pointerOffset.x + offset + 0.5 + size > clientWidth;
		const isLargerY: boolean = pointerOffset.y + offset + 0.5 + size > clientHeight;
		const isSmallerX: boolean = pointerOffset.x - offset - 0.5 - size < 0;
		const isSmallerY: boolean = pointerOffset.y - offset - 0.5 - size < 0;

		let resultX: number = pointerOffset.x;
		let resultY: number = pointerOffset.y;

		if (isLargerX) {
			const diffX: number = -(offset + 0.5) - size;
			resultX += diffX;
			this.prevOffsetX = diffX;
		} else {
			if (isSmallerX) {
				const diffX: number = offset + 0.5;
				resultX += diffX;
				this.prevOffsetX = diffX;
			} else {
				resultX += this.prevOffsetX;
			}
		}
		if (isLargerY) {
			const diffY: number = -(offset + 0.5) - size;
			resultY += diffY;
			this.prevOffsetY = diffY;
		} else {
			if (isSmallerY) {
				const diffY: number = offset + 0.5;
				resultY += diffY;
				this.prevOffsetY = diffY;
			} else {
				resultY += this.prevOffsetY;
			}
		}

		//

		ctx.save();
		ctx.imageSmoothingEnabled = false;
		ctx.translate(resultX, resultY);

		// Clip in circle shape
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		ctx.clip();
		ctx.stroke();

		// Initialize background color
		ctx.beginPath();
		ctx.fillStyle = this.bgColor;
		ctx.fillRect(0, 0, size, size);
		ctx.stroke();

		// Draw a pixelated image
		ctx.drawImage(
			this.memory.renderer.element.main,
			pointerOffset.x - rendererOffset.x - ratio / 2,
			pointerOffset.y - rendererOffset.y - ratio / 2,
			ratio,
			ratio,
			0,
			0,
			size,
			size
		);

		// Draw grid on an image
		ctx.beginPath();
		ctx.strokeStyle = this.gridColor;
		for (let i = 0; i < size; i += size / ratio) {
			if (i === size / 2) {
				ctx.moveTo(i, 0);
				ctx.lineTo(i, size / 2 - 5);
				ctx.moveTo(i, size / 2 + 5);
				ctx.lineTo(i, size);
			} else {
				ctx.moveTo(i, 0);
				ctx.lineTo(i, size);
			}
		}
		for (let i = 0; i < size; i += size / ratio) {
			if (i === size / 2) {
				ctx.moveTo(0, i);
				ctx.lineTo(size / 2 - 5, i);
				ctx.moveTo(size / 2 + 5, i);
				ctx.lineTo(size, i);
			} else {
				ctx.moveTo(0, i);
				ctx.lineTo(size, i);
			}
		}
		ctx.stroke();

		// Draw a center indicator
		ctx.beginPath();
		ctx.strokeStyle = `#${this.prevPixel}`;
		ctx.arc(size / 2, size / 2, 5, 0, Math.PI * 2);
		ctx.stroke();

		// Draw cirlce border
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = `#${this.prevPixel}`;
		ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
		ctx.stroke();

		ctx.restore();
	}
}
