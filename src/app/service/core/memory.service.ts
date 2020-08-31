import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MemoryService {
	constructor() {}

	renderer = {} as Renderer;

	initRenderer($psdViewer: HTMLDivElement, $dropArea: HTMLDivElement, $main: HTMLCanvasElement): void {
		this.renderer.psdViewer = $psdViewer;
		this.renderer.dropArea = $dropArea;
		this.renderer.main = $main;
	}
}

interface Renderer {
	psdViewer: HTMLDivElement;
	dropArea: HTMLDivElement;
	main: HTMLCanvasElement;
}
