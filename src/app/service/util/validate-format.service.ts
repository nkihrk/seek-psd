import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ValidateFormatService {
	constructor() {}

	isValidImageFormatBlob($fileName: string): boolean {
		return /\.(jpe?g|png|bmp)$/i.test($fileName);
	}

	isValidImageFormatFile($fileName): boolean {
		return /\.(psd)$/i.test($fileName);
	}
}
