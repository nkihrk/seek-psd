import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Psd } from 'ag-psd';

@Injectable({
	providedIn: 'root'
})
export class MemoryService {
	constructor() {}

	psdDataSubject: Subject<{ psd; fileName: string }> = new Subject();
	psdDataState = this.psdDataSubject.asObservable();

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
