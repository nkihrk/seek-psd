import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Offset } from '../../model/offset.model';
import { Pointer } from '../../model/pointer.model';
import { Crop } from '../../model/crop.model';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
import { NotifierService } from 'angular-notifier';

@Injectable({
	providedIn: 'root'
})
export class CropService {
	private offset = {
		current: {
			x: 0,
			y: 0
		},
		prev: {
			x: 0,
			y: 0
		}
	};
	private size = {
		width: 500,
		height: 500
	};
	private cursorState = {
		isSwitched: false,
		areaName: ''
	};

	private cornerSize = 20;
	private barSize = 30;

	constructor(private memory: MemoryService, private notifier: NotifierService) {
		this.memory.crop$.subscribe(($crop: Crop) => {
			if (!this.memory.isLoaded$.getValue()) return;

			// Update local variables anytime updateCrop() is called, and return
			// This may occur when PSD is first loaded
			if (this.memory.reservedByFunc$.getValue().current.name !== 'crop') {
				this.offset = $crop.offset;
				this.size = $crop.size;
				return;
			}

			this.offset = $crop.offset;
			this.size.width = !!$crop.size.width ? $crop.size.width : this.size.width;
			this.size.height = !!$crop.size.height ? $crop.size.height : this.size.height;

			// Validate offset and size
			this._validateOffset();

			const crop: Crop = {
				offset: this.offset,
				size: this.size
			};
			this.render(crop);
		});
	}

	validateInput($crop: Crop): void {
		const w: number = !!$crop.size.width ? $crop.size.width : this.size.width;
		const h: number = !!$crop.size.height ? $crop.size.height : this.size.height;

		const minLength: number = this.cornerSize * 2;
		const maxWidth: number = this.memory.renderer.size.width;
		const maxHeight: number = this.memory.renderer.size.height;
		const isSmaller: boolean = w < minLength || h < minLength;
		const isBigger: boolean = maxWidth < w || maxHeight < h;

		if (minLength <= w && w <= maxWidth) {
			this.size.width = w;
		} else {
			// Width validation
			if (maxWidth < w && this.size.width !== maxWidth) {
				this.size.width = maxWidth;
			} else {
				return;
			}
		}

		if (minLength <= h && h <= maxHeight) {
			this.size.height = h;
		} else {
			// Height validation
			if (maxHeight < h && this.size.height !== maxHeight) {
				this.size.height = maxHeight;
			} else {
				return;
			}
		}

		const crop: Crop = {
			offset: this.offset,
			size: this.size
		};
		this.memory.updateCrop(crop);
	}

	activate(): void {
		this.memory.updateReservedByFunc({
			name: 'crop',
			type: '',
			group: ''
		});

		this.render(this.memory.crop$.getValue());
	}

	getImage(): void {
		try {
			const cBuffer: HTMLCanvasElement = this.memory.renderer.element.buffer;
			const c: HTMLCanvasElement = document.createElement('canvas');
			c.width = this.size.width / this.memory.renderer.size.scaleRatio;
			c.height = this.size.height / this.memory.renderer.size.scaleRatio;
			const ctx: CanvasRenderingContext2D = c.getContext('2d');

			const fixedX: number = (this.offset.current.x - this.size.width / 2) / this.memory.renderer.size.scaleRatio;
			const fixedY: number = (this.offset.current.y - this.size.height / 2) / this.memory.renderer.size.scaleRatio;
			const fixedW: number = this.size.width / this.memory.renderer.size.scaleRatio;
			const fixedH: number = this.size.height / this.memory.renderer.size.scaleRatio;

			ctx.drawImage(cBuffer, fixedX, fixedY, fixedW, fixedH, 0, 0, c.width, c.height);

			c.toBlob(($blob: Blob) => {
				const fName: string = this.memory.fileName$.getValue().split('.')[0];
				saveAs($blob, fName);
			}, 'image/png');

			// Initialize
			this.memory.updateReservedByFunc({
				name: '',
				type: '',
				group: ''
			});
			this.memory.renderer.element.overlay.width = 1;
			this.memory.renderer.element.overlay.height = 1;
		} catch ($e) {
			console.log($e);

			this.notifier.notify('error', 'ファイルの出力に失敗しました');
		}
	}

	registerOnMouseDown(): void {
		// To sync crop offsets with dataList
		this.offset.prev.x = this.offset.current.x;
		this.offset.prev.y = this.offset.current.y;

		//////////////////////////////////////////////////////////
		//
		// Switch cursor type
		//
		//////////////////////////////////////////////////////////

		const c: HTMLCanvasElement = this.memory.renderer.element.overlay;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');
		const crop: Crop = {
			offset: this.offset,
			size: this.size
		};

		this.switchCursor(ctx, crop);
	}

	private switchCursor($ctx: CanvasRenderingContext2D, $crop: Crop): void {
		const areaX: number = $crop.offset.current.x;
		const areaY: number = $crop.offset.current.y;
		const areaWidth: number = $crop.size.width;
		const areaHeight: number = $crop.size.height;

		$ctx.translate(areaX, areaY);

		//////////////////////////////////////////////////////////
		//
		// Create area paths
		//
		//////////////////////////////////////////////////////////

		// Left-up
		const leftUp = new Path2D();
		leftUp.rect(
			-areaWidth / 2 - this.cornerSize,
			-areaHeight / 2 - this.cornerSize,
			this.cornerSize * 2,
			this.cornerSize * 2
		);
		// Left-down
		const leftDown = new Path2D();
		leftDown.rect(
			-areaWidth / 2 - this.cornerSize,
			areaHeight / 2 - this.cornerSize,
			this.cornerSize * 2,
			this.cornerSize * 2
		);
		// Right-down
		const rightDown = new Path2D();
		rightDown.rect(
			areaWidth / 2 - this.cornerSize,
			areaHeight / 2 - this.cornerSize,
			this.cornerSize * 2,
			this.cornerSize * 2
		);
		// Right-up
		const rightUp = new Path2D();
		rightUp.rect(
			areaWidth / 2 - this.cornerSize,
			-areaHeight / 2 - this.cornerSize,
			this.cornerSize * 2,
			this.cornerSize * 2
		);

		// Middle-up
		const middleUp = new Path2D();
		middleUp.rect(-this.barSize / 2, -areaHeight / 2 - this.barSize / 2, this.barSize, this.barSize);
		// Middle-left
		const middleLeft = new Path2D();
		middleLeft.rect(-areaWidth / 2 - this.barSize / 2, -this.barSize / 2, this.barSize, this.barSize);
		// Middle-down
		const middleDown = new Path2D();
		middleDown.rect(-this.barSize / 2, areaHeight / 2 - this.barSize / 2, this.barSize, this.barSize);
		// Middle-right
		const middleRight = new Path2D();
		middleRight.rect(areaWidth / 2 - this.barSize / 2, -this.barSize / 2, this.barSize, this.barSize);

		//////////////////////////////////////////////////////////
		//
		// Switch cursor type with css
		//
		//////////////////////////////////////////////////////////

		const rendererOffset: DOMRect = this.memory.renderer.element.main.getBoundingClientRect();

		const isLeftUp: boolean = $ctx.isPointInPath(
			leftUp,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);
		const isRightDown: boolean = $ctx.isPointInPath(
			rightDown,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);

		const isLeftDown: boolean = $ctx.isPointInPath(
			leftDown,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);
		const isRightUp: boolean = $ctx.isPointInPath(
			rightUp,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);

		const isMiddleUp: boolean = $ctx.isPointInPath(
			middleUp,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);
		const isMiddleDown: boolean = $ctx.isPointInPath(
			middleDown,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);

		const isMiddleRight: boolean = $ctx.isPointInPath(
			middleRight,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);
		const isMiddleLeft: boolean = $ctx.isPointInPath(
			middleLeft,
			this.memory.pointerOffset.current.x,
			this.memory.pointerOffset.current.y
		);

		const target: HTMLDivElement = this.memory.renderer.element.psdViewer;
		if (
			(isLeftUp ||
				isRightDown ||
				isLeftDown ||
				isRightUp ||
				isMiddleUp ||
				isMiddleDown ||
				isMiddleRight ||
				isMiddleLeft) &&
			!this.cursorState.isSwitched
		) {
			if (isLeftUp || isRightDown) {
				if (!target.classList.contains('nwse-resize')) target.classList.add('nwse-resize');

				if (isLeftUp) {
					this.cursorState.areaName = 'leftUp';
				} else {
					this.cursorState.areaName = 'rightDown';
				}
			} else if (isLeftDown || isRightUp) {
				if (!target.classList.contains('nesw-resize')) target.classList.add('nesw-resize');

				if (isLeftDown) {
					this.cursorState.areaName = 'leftDown';
				} else {
					this.cursorState.areaName = 'rightUp';
				}
			} else if (isMiddleUp || isMiddleDown) {
				if (!target.classList.contains('ns-resize')) target.classList.add('ns-resize');

				if (isMiddleUp) {
					this.cursorState.areaName = 'middleUp';
				} else {
					this.cursorState.areaName = 'middleDown';
				}
			} else if (isMiddleRight || isMiddleLeft) {
				if (!target.classList.contains('ew-resize')) target.classList.add('ew-resize');

				if (isMiddleRight) {
					this.cursorState.areaName = 'middleRight';
				} else {
					this.cursorState.areaName = 'middleLeft';
				}
			}

			// Allow sizing of cropping area
			this.cursorState.isSwitched = true;
		} else {
			if (!this.cursorState.isSwitched) {
				this.resetStates();
			}
		}
	}

	registerOnMouseLeftUp(): void {
		this.resetStates();
	}

	private resetStates(): void {
		const target: HTMLDivElement = this.memory.renderer.element.psdViewer;
		target.classList.remove('nwse-resize');
		target.classList.remove('nesw-resize');
		target.classList.remove('ns-resize');
		target.classList.remove('ew-resize');

		this.cursorState.isSwitched = false;
		this.cursorState.areaName = '';
	}

	registerOnMouseLeftDownMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		if (this.cursorState.isSwitched) {
			// Calcurate size of cropping area
			this._calcSize();
		} else {
			// Calcurate offsets of cropping area
			this._calcOffset($newOffsetX, $newOffsetY);
		}

		const crop: Crop = {
			offset: this.offset,
			size: this.size
		};
		this.memory.updateCrop(crop);
	}

	private _calcOffset($newOffsetX: number, $newOffsetY: number): void {
		this.offset.current.x = this.offset.prev.x + $newOffsetX;
		this.offset.current.y = this.offset.prev.y + $newOffsetY;
	}

	private _calcSize(): void {
		const switchName: string = this.cursorState.areaName;
		const canvasWidth: number = this.memory.renderer.element.main.getBoundingClientRect().width;
		const canvasHeight: number = this.memory.renderer.element.main.getBoundingClientRect().height;
		const diffX: number = this.memory.pointerOffset.current.x - this.offset.current.x;
		const diffY: number = this.memory.pointerOffset.current.y - this.offset.current.y;

		let halfW: number = this.size.width / 2;
		let halfH: number = this.size.height / 2;

		switch (switchName) {
			case 'leftUp':
				halfW -= diffX;
				halfH -= diffY;
				break;

			case 'rightDown':
				halfW += diffX;
				halfH += diffY;
				break;

			case 'leftDown':
				halfW -= diffX;
				halfH += diffY;
				break;

			case 'rightUp':
				halfW += diffX;
				halfH -= diffY;
				break;

			case 'middleUp':
				halfH -= diffY;
				break;

			case 'middleDown':
				halfH += diffY;
				break;

			case 'middleRight':
				halfW += diffX;
				break;

			case 'middleLeft':
				halfW -= diffX;
				break;

			default:
				break;
		}

		const min: number = this.cornerSize + this.barSize / 2;
		const maxW: number = canvasWidth;
		const maxH: number = canvasHeight;
		const isLargerW: boolean = halfW > min;
		const isLargerH: boolean = halfH > min;
		const isSmallerW: boolean = halfW < maxW;
		const isSmallerH: boolean = halfH < maxH;

		if (halfW !== this.size.width / 2) {
			this.size.width = isLargerW ? (isSmallerW ? halfW : maxW) : min;
		}
		if (halfH !== this.size.height / 2) {
			this.size.height = isLargerH ? (isSmallerH ? halfH : maxH) : min;
		}
	}

	private _validateOffset(): void {
		const canvasWidth: number = this.memory.renderer.element.main.getBoundingClientRect().width;
		const canvasHeight: number = this.memory.renderer.element.main.getBoundingClientRect().height;
		const minX: number = this.size.width / 2;
		const minY: number = this.size.height / 2;
		const maxX: number = canvasWidth;
		const maxY: number = canvasHeight;
		const x: number = this.offset.current.x;
		const y: number = this.offset.current.y;

		// x
		if (x - minX < 0) this.offset.current.x = minX;
		if (canvasWidth < x + minX) this.offset.current.x = canvasWidth - minX;
		// y
		if (y - minY < 0) this.offset.current.y = minY;
		if (canvasHeight < y + minY) this.offset.current.y = canvasHeight - minY;
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Render
	//
	///////////////////////////////////////////////////////////////////////////

	render($crop: Crop): void {
		const c: HTMLCanvasElement = this.memory.renderer.element.overlay;
		c.width = this.memory.renderer.element.main.getBoundingClientRect().width;
		c.height = this.memory.renderer.element.main.getBoundingClientRect().height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		this._createBackground(ctx);
		this._createArea(ctx, $crop);
	}

	private _createBackground($ctx: CanvasRenderingContext2D): void {
		const canvasWidth: number = this.memory.renderer.element.main.getBoundingClientRect().width;
		const canvasHeight: number = this.memory.renderer.element.main.getBoundingClientRect().height;

		// Background
		$ctx.save();
		$ctx.imageSmoothingEnabled = false;
		$ctx.translate(canvasWidth / 2, canvasHeight / 2);
		$ctx.beginPath();
		$ctx.moveTo(-canvasWidth / 2, -canvasHeight / 2);
		$ctx.lineTo(-canvasWidth / 2, canvasHeight / 2);
		$ctx.lineTo(canvasWidth / 2, canvasHeight / 2);
		$ctx.lineTo(canvasWidth / 2, -canvasHeight / 2);
		$ctx.globalAlpha = 0.5;
		$ctx.closePath();
		$ctx.fill();
		$ctx.globalAlpha = 1.0;
		$ctx.restore();
	}

	private _createArea($ctx: CanvasRenderingContext2D, $crop: Crop): void {
		const areaX: number = $crop.offset.current.x;
		const areaY: number = $crop.offset.current.y;
		const areaWidth: number = $crop.size.width;
		const areaHeight: number = $crop.size.height;

		$ctx.save();
		$ctx.imageSmoothingEnabled = false;
		$ctx.translate(areaX, areaY);
		$ctx.beginPath();
		$ctx.moveTo(-areaWidth / 2, -areaHeight / 2);
		$ctx.lineTo(-areaWidth / 2, areaHeight / 2);
		$ctx.lineTo(areaWidth / 2, areaHeight / 2);
		$ctx.lineTo(areaWidth / 2, -areaHeight / 2);
		$ctx.closePath();
		$ctx.globalCompositeOperation = 'destination-out';
		$ctx.fill();
		$ctx.globalCompositeOperation = 'source-over';

		this._drawArea($ctx, $crop.size);

		$ctx.restore();
	}

	private _drawArea($ctx: CanvasRenderingContext2D, $size: { width: number; height: number }): void {
		const areaWidth: number = $size.width;
		const areaHeight: number = $size.height;

		$ctx.beginPath();
		$ctx.lineWidth = 1;
		$ctx.strokeStyle = 'white';
		$ctx.fillStyle = 'white';
		// Frame
		$ctx.rect(-areaWidth / 2, -areaHeight / 2, areaWidth, areaHeight);
		// Left-up
		$ctx.fillRect(-areaWidth / 2, -areaHeight / 2, this.cornerSize, 3);
		$ctx.fillRect(-areaWidth / 2, -areaHeight / 2, 3, this.cornerSize);
		// Left-down
		$ctx.fillRect(-areaWidth / 2, areaHeight / 2, this.cornerSize, -3);
		$ctx.fillRect(-areaWidth / 2, areaHeight / 2, 3, -this.cornerSize);
		// Right-down
		$ctx.fillRect(areaWidth / 2, areaHeight / 2, -this.cornerSize, -3);
		$ctx.fillRect(areaWidth / 2, areaHeight / 2, -3, -this.cornerSize);
		// Right-up
		$ctx.fillRect(areaWidth / 2, -areaHeight / 2, -this.cornerSize, 3);
		$ctx.fillRect(areaWidth / 2, -areaHeight / 2, -3, this.cornerSize);

		// Middle-up
		$ctx.fillRect(-this.barSize / 2, -areaHeight / 2, this.barSize, 3);
		// Middle-left
		$ctx.fillRect(-areaWidth / 2, -this.barSize / 2, 3, this.barSize);
		// Middle-down
		$ctx.fillRect(-this.barSize / 2, areaHeight / 2, this.barSize, -3);
		// Middle-right
		$ctx.fillRect(areaWidth / 2, -this.barSize / 2, -3, this.barSize);

		// Separation
		$ctx.lineWidth = 0.5;
		for (let i = -areaWidth / 2; i < (areaWidth * 2) / 3; i += areaWidth / 3) {
			$ctx.moveTo(i, -areaHeight / 2);
			$ctx.lineTo(i, areaHeight / 2);
		}
		for (let i = -areaHeight / 2; i < (areaHeight * 2) / 3; i += areaHeight / 3) {
			$ctx.moveTo(-areaWidth / 2, i);
			$ctx.lineTo(areaWidth / 2, i);
		}

		$ctx.stroke();
	}
}
