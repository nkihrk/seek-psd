import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { Pointer } from '../model/pointer.model';

@Directive({
	selector: '[appPointerEvent]'
})
export class PointerEventDirective {
	@Output() pointerData = new EventEmitter<Pointer>();

	private downFlg = false;
	private moveFlg = false;

	// Mouse button number
	private btn = 0;

	constructor() {}

	_emitData($clientX: number, $clientY: number): void {
		this.pointerData.emit({
			x: $clientX,
			y: $clientY,
			btn: this.btn,
			downFlg: this.downFlg,
			moveFlg: this.moveFlg
		});
	}

	_resetAllFlgs(): void {
		this.downFlg = false;
		this.moveFlg = false;
	}

	// Pointerdown listener
	@HostListener('document:pointerdown', ['$event']) onPointerDown($e): void {
		this._onDown($e);
	}

	// Pointerup listener
	@HostListener('document:pointerup', ['$event']) onPointerUp($e): void {
		this._onUp($e);
	}

	// Pointermove listener
	@HostListener('document:pointermove', ['$event']) onPointerMove($e): void {
		this._onMove($e);
	}

	// Down event
	_onDown($e: any): void {
		let clientX: number;
		let clientY: number;

		clientX = $e.clientX;
		clientY = $e.clientY;
		this.btn = $e.button;

		// Initialize flags
		this._resetAllFlgs();
		this.downFlg = true;
		this._emitData(clientX, clientY);
	}

	// Up event
	_onUp($e: any): void {
		let clientX: number;
		let clientY: number;

		clientX = $e.clientX;
		clientY = $e.clientY;

		// Initialize flags
		this._resetAllFlgs();
		this._emitData(clientX, clientY);
	}

	// Move event
	_onMove($e: any): void {
		let clientX: number;
		let clientY: number;

		clientX = $e.clientX;
		clientY = $e.clientY;

		this.moveFlg = true;
		this._emitData(clientX, clientY);
	}
}
