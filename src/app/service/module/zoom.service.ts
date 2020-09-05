import { Injectable } from '@angular/core';
import { MemoryService } from '../core/memory.service';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  constructor(private memory: MemoryService) { }

	activate(): void {
		this.memory.updateReservedByFunc({
			name: 'zoom',
			type: '',
			group: ''
		});
	}
}
