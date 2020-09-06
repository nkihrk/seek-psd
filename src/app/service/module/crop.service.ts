import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { Offset } from '../../model/offset.model';
import { Pointer } from '../../model/pointer.model';

@Injectable({
	providedIn: 'root'
})
export class CropService {
	private cropOffset: Offset = {
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

	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.updateReservedByFunc({
			name: 'crop',
			type: '',
			group: ''
		});

		this.render();
	}

	registerOnMouseDown(): void {
		// To sync crop offsets with dataList
		this.cropOffset.prev.x = this.cropOffset.current.x;
		this.cropOffset.prev.y = this.cropOffset.current.y;
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
			this._calcCropArea();
		} else {
			// Calcurate offsets of cropping area
			this.updatePointerOffset($newOffsetX, $newOffsetY);
		}

		this.render();
	}

	private updatePointerOffset($newOffsetX: number, $newOffsetY: number): void {
		this.cropOffset.current.x = this.cropOffset.prev.x + $newOffsetX;
		this.cropOffset.current.y = this.cropOffset.prev.y + $newOffsetY;
	}

	private _calcCropArea(): void {
		this._calcSize();
		this._calcOffsets();
	}

	private _calcSize(): void {
		const switchName: string = this.cursorState.areaName;
		const canvasWidth: number = this.memory.renderer.element.main.clientWidth;
		const canvasHeight: number = this.memory.renderer.element.main.clientHeight;
		const diffX: number = this.memory.pointerOffset.current.x - this.cropOffset.current.x;
		const diffY: number = this.memory.pointerOffset.current.y - this.cropOffset.current.y;

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

	private _calcOffsets(): void {
		const canvasWidth: number = this.memory.renderer.element.main.clientWidth;
		const canvasHeight: number = this.memory.renderer.element.main.clientHeight;
		const minX: number = this.size.width / 2;
		const minY: number = this.size.height / 2;
		const maxX: number = canvasWidth;
		const maxY: number = canvasHeight;
		let fixedX: number = this.cropOffset.current.x;
		let fixedY: number = this.cropOffset.current.y;
		fixedX = fixedX >= minX ? fixedX : minX;
		fixedY = fixedY >= minY ? fixedY : minY;
		fixedX = fixedX >= maxX - minX ? maxX - minX : fixedX;
		fixedY = fixedY >= maxY - minY ? maxY - minY : fixedY;

		this.cropOffset.current.x = fixedX;
		this.cropOffset.current.y = fixedY;
	}

	render(): void {
		const c: HTMLCanvasElement = this.memory.renderer.element.overlay;
		c.width = this.memory.renderer.element.main.clientWidth;
		c.height = this.memory.renderer.element.main.clientHeight;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');
		const canvasWidth: number = this.memory.renderer.element.main.clientWidth;
		const canvasHeight: number = this.memory.renderer.element.main.clientHeight;

		const minX: number = this.size.width / 2;
		const minY: number = this.size.height / 2;
		const maxX: number = canvasWidth;
		const maxY: number = canvasHeight;
		const x: number = this.cropOffset.current.x;
		const y: number = this.cropOffset.current.y;

		// x
		if (x - minX < 0) this.cropOffset.current.x = minX;
		if (canvasWidth < x + minX) this.cropOffset.current.x = canvasWidth - minX;
		// y
		if (y - minY < 0) this.cropOffset.current.y = minY;
		if (canvasHeight < y + minY) this.cropOffset.current.y = canvasHeight - minY;

		let fixedX: number = this.cropOffset.current.x;
		let fixedY: number = this.cropOffset.current.y;

		this._createBackground(ctx);
		this._createArea(ctx, fixedX, fixedY);
	}

	private _createBackground($ctx: CanvasRenderingContext2D): void {
		const canvasWidth: number = this.memory.renderer.element.main.clientWidth;
		const canvasHeight: number = this.memory.renderer.element.main.clientHeight;

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

	private _createArea($ctx: CanvasRenderingContext2D, $fixedX: number, $fixedY: number): void {
		const areaWidth: number = this.size.width;
		const areaHeight: number = this.size.height;

		$ctx.save();
		$ctx.imageSmoothingEnabled = false;
		$ctx.translate($fixedX, $fixedY);
		$ctx.beginPath();
		$ctx.moveTo(-areaWidth / 2, -areaHeight / 2);
		$ctx.lineTo(-areaWidth / 2, areaHeight / 2);
		$ctx.lineTo(areaWidth / 2, areaHeight / 2);
		$ctx.lineTo(areaWidth / 2, -areaHeight / 2);
		$ctx.closePath();
		$ctx.globalCompositeOperation = 'destination-out';
		$ctx.fill();
		$ctx.globalCompositeOperation = 'source-over';

		this._drawArea($ctx);

		$ctx.restore();
	}

	private _drawArea($ctx: CanvasRenderingContext2D): void {
		const areaWidth: number = this.size.width;
		const areaHeight: number = this.size.height;

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

		//////////////////////////////////////////////////////////
		//
		// Switch cursor type
		//
		//////////////////////////////////////////////////////////

		this.switchCursor($ctx);
	}

	private switchCursor($ctx: CanvasRenderingContext2D): void {
		const areaWidth: number = this.size.width;
		const areaHeight: number = this.size.height;

		//////////////////////////////////////////////////////////
		//
		// Create area paths
		//
		//////////////////////////////////////////////////////////

		// Left-up
		const leftUp = new Path2D();
		leftUp.rect(-areaWidth / 2 - 10, -areaHeight / 2 - 10, this.cornerSize, this.cornerSize);
		// Left-down
		const leftDown = new Path2D();
		leftDown.rect(-areaWidth / 2 - 10, areaHeight / 2 - 10, this.cornerSize, this.cornerSize);
		// Right-down
		const rightDown = new Path2D();
		rightDown.rect(areaWidth / 2 - 10, areaHeight / 2 - 10, this.cornerSize, this.cornerSize);
		// Right-up
		const rightUp = new Path2D();
		rightUp.rect(areaWidth / 2 - 10, -areaHeight / 2 - 10, this.cornerSize, this.cornerSize);

		// Middle-up
		const middleUp = new Path2D();
		middleUp.rect(-this.barSize / 2, -areaHeight / 2 - 15, this.barSize, this.barSize);
		// Middle-left
		const middleLeft = new Path2D();
		middleLeft.rect(-areaWidth / 2 - 15, -this.barSize / 2, this.barSize, this.barSize);
		// Middle-down
		const middleDown = new Path2D();
		middleDown.rect(-this.barSize / 2, areaHeight / 2 - 15, this.barSize, this.barSize);
		// Middle-right
		const middleRight = new Path2D();
		middleRight.rect(areaWidth / 2 - 15, -this.barSize / 2, this.barSize, this.barSize);

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

			// Allow sizing cropping area
			this.cursorState.isSwitched = true;
		} else {
			if (!this.cursorState.isSwitched) {
				this.resetStates();
			}
		}
	}
}
