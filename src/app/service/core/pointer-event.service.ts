import { Injectable } from '@angular/core';
import { MemoryService } from './memory.service';
import { Pointer } from '../../model/pointer.model';

// Modules
import { ColorPickerService } from '../module/color-picker.service';
import { CropService } from '../module/crop.service';

@Injectable({
	providedIn: 'root'
})
export class PointerEventService {
	constructor(private memory: MemoryService, private colorPicker: ColorPickerService, private crop: CropService) {}

	down(): void {}

	leftDown($name: string): void {
		switch ($name) {
			case 'crop':
				this.crop.registerOnMouseDown();
				break;

			default:
				break;
		}
	}

	rightDown(): void {}

	middleDown(): void {}

	noDown($name: string): void {
		switch ($name) {
			case 'color-picker':
				this.colorPicker.render();
				break;

			default:
				break;
		}
	}

	leftUp($name: string): void {
		switch ($name) {
			case 'color-picker':
				this.colorPicker.getColor();
				break;

			case 'crop':
				this.crop.registerOnMouseLeftUp();
				break;

			default:
				break;
		}
	}

	rightUp(): void {}

	middleUp(): void {}

	leftDownMove($name: string, $newOffsetX: number, $newOffsetY: number, $event: Pointer): void {
		switch ($name) {
			case 'color-picker':
				this.colorPicker.render();
				break;

			case 'crop':
				this.crop.registerOnMouseLeftDownMove($newOffsetX, $newOffsetY, $event);
				break;

			default:
				break;
		}
	}

	rightDownMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {}

	middleDownMove($newOffsetX: number, $newOffsetY: number, $event: Pointer): void {}
}
