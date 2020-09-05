import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { RegisterService } from './register.service';
import { Pointer } from '../../model/pointer.model';

@Injectable({
	providedIn: 'root'
})
export class CpuService {
	// Detect idling of pointer events
	private idleTimer: NodeJS.Timeout;
	private idleInterval = 1;

	constructor(private memory: MemoryService, private register: RegisterService) {}

	////////////////////////////////////////////////////////////////////////////////////////////
	//
	// CPU
	//
	////////////////////////////////////////////////////////////////////////////////////////////

	update($event: Pointer): void {
		// Update ouseOffset
		this.memory.pointerOffset.current.x = $event.x - this.memory.renderer.element.main.getBoundingClientRect().left;
		this.memory.pointerOffset.current.y = $event.y - this.memory.renderer.element.main.getBoundingClientRect().top;
		this.memory.pointerOffset.raw.x = $event.x;
		this.memory.pointerOffset.raw.y = $event.y;

		// When pointer button is down
		if (this.memory.flgs.leftDownFlg || this.memory.flgs.middleDownFlg || this.memory.flgs.rightDownFlg) {
			this._onPointerDown();
		}

		// When pointer button is up
		if (this.memory.flgs.leftUpFlg || this.memory.flgs.middleUpFlg || this.memory.flgs.rightUpFlg) {
			this._onPointerUp();
		}

		// Update anytime when the event is not pointerdown
		if (!this.memory.flgs.downFlg) {
			this._onNoPointerDown($event);
		}

		// Only allow left and middle buttons
		if (this.memory.flgs.leftDownMoveFlg || this.memory.flgs.middleDownMoveFlg) {
			this._onPointerMove($event);
		}
	}

	//////////////////////////////////////////////////////////
	//
	// Pointerdown event
	//
	//////////////////////////////////////////////////////////

	_onPointerDown(): void {
		// Pointerdown event with no pointermove
		this.memory.pointerOffset.prev.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.prev.y = this.memory.pointerOffset.current.y;
		this.memory.pointerOffset.tmp.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.tmp.y = this.memory.pointerOffset.current.y;

		this.register.onPointerDown();
	}

	private _onShadowPointerDown(): void {
		// Pointerdown event with no pointermove
		this.memory.pointerOffset.tmp.x = this.memory.pointerOffset.current.x;
		this.memory.pointerOffset.tmp.y = this.memory.pointerOffset.current.y;
	}

	//////////////////////////////////////////////////////////
	//
	// Pointerup event
	//
	//////////////////////////////////////////////////////////

	_onPointerUp(): void {
		this.register.onPointerUp();
	}

	//////////////////////////////////////////////////////////
	//
	// All events but pointerdown
	//
	//////////////////////////////////////////////////////////

	_onNoPointerDown($event: Pointer): void {
		this.register.onNoPointerDown($event);
	}

	//////////////////////////////////////////////////////////
	//
	// Pointermove event
	//
	//////////////////////////////////////////////////////////

	_onPointerMove($event: Pointer): void {
		// Check if its idling
		this._onIdle($event);

		const newOffsetX: number = this.memory.pointerOffset.current.x - this.memory.pointerOffset.prev.x;
		const newOffsetY: number = this.memory.pointerOffset.current.y - this.memory.pointerOffset.prev.y;

		this.register.onPointerMove(newOffsetX, newOffsetY, $event);
	}

	private _onIdle($event: Pointer): void {
		if (!!this.idleTimer) clearInterval(this.idleTimer);
		this.idleTimer = setTimeout(() => {
			this._onShadowPointerDown();
		}, this.idleInterval);
	}
}
