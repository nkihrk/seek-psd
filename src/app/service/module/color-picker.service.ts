import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';
import { NotifierService } from 'angular-notifier';

@Injectable({
	providedIn: 'root'
})
export class ColorPickerService {
	constructor(private memory: MemoryService, private notifier: NotifierService) {}

	activate(): void {
		this.memory.updateReservedByFunc({
			name: 'color-picker',
			type: '',
			group: ''
		});

		this.notifier.notify('success', 'クリップボードにコピー : #333333');
	}

	render(): void {}
}
