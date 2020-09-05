import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';

@Injectable({
	providedIn: 'root'
})
export class ColorPickerService {
	constructor(private memory: MemoryService) {}

	activate(): void {
		this.memory.updateReservedByFunc({
			name: 'color-picker',
			type: '',
			group: ''
		});
	}
}
