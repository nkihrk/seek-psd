import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { PointerEventService } from './pointer-event.service';
import { Flgs } from '../../model/flgs.model';
import { Pointer } from '../../model/pointer.model';

@Injectable({
	providedIn: 'root'
})
export class RegisterService {
	constructor(private memory: MemoryService, private pointerEvent: PointerEventService) {}

	onPointerDown(): void {
		const flgs: Flgs = this.memory.flgs;
		const name: string = this.memory.reservedByFunc$.getValue().current.name;

		this.pointerEvent.down();

		if (flgs.leftDownFlg) {
			this.pointerEvent.leftDown(name);
		} else if (flgs.rightDownFlg) {
			this.pointerEvent.rightDown();
		} else if (flgs.middleDownFlg) {
			this.pointerEvent.middleDown();
		}
	}

	onNoPointerDown($event: Pointer): void {
		const name: string = this.memory.reservedByFunc$.getValue().current.name;
		this.pointerEvent.noDown(name);
	}

	onPointerUp(): void {
		const flgs: Flgs = this.memory.flgs;

		if (flgs.leftUpFlg) {
			this.pointerEvent.leftUp();
		} else if (flgs.rightUpFlg) {
			this.pointerEvent.rightUp();
		} else if (flgs.middleUpFlg) {
			this.pointerEvent.middleUp();
		}
	}

	onPointerMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		const flgs: Flgs = this.memory.flgs;
		const name: string = this.memory.reservedByFunc$.getValue().current.name;

		if (flgs.leftDownMoveFlg) {
			this.pointerEvent.leftDownMove(name, $newOffsetX, $newOffsetY, $event);
		} else if (flgs.rightDownMoveFlg) {
			this.pointerEvent.rightDownMove($newOffsetX, $newOffsetY, $event);
		} else if (flgs.middleDownMoveFlg) {
			this.pointerEvent.middleDownMove($newOffsetX, $newOffsetY, $event);
		}
	}
}
