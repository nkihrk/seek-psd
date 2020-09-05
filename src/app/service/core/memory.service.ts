import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Psd } from 'ag-psd';
import { LayerInfo } from '../../model/layer-info.model';

@Injectable({
	providedIn: 'root'
})
export class MemoryService {
	constructor() {}

	// Streaming
	psdData$: Subject<{ psd: Psd; fileName: string }> = new Subject();
	layerInfos$: BehaviorSubject<LayerInfo[]> = new BehaviorSubject([]);
	fileName$: BehaviorSubject<string> = new BehaviorSubject('');

	renderer = { element: {} as Element, size: {} as Size } as Renderer;

	initRenderer($psdViewer: HTMLDivElement, $dropArea: HTMLDivElement, $main: HTMLCanvasElement): void {
		this.renderer.element.psdViewer = $psdViewer;
		this.renderer.element.dropArea = $dropArea;
		this.renderer.element.main = $main;
	}

	updateRenderer($fileName: string, $size: { width: number; height: number; scaleRatio: number }, $psd: Psd): void {
		this.renderer.fileName = $fileName;
		this.renderer.size = $size;
		this.renderer.psd = $psd;
	}

	updateLayerInfos($layerInfos: LayerInfo[]): void {
		this.layerInfos$.next($layerInfos);
	}

	updateFileName($name: string): void {
		this.fileName$.next($name);
	}

	refreshData(): void {
		this.updateRenderer('', null, null);
		this.updateLayerInfos([]);
		this.updateFileName('');
	}
}

interface Renderer {
	element: Element;
	fileName: string;
	size: Size;
	psd: Psd;
}

interface Element {
	psdViewer: HTMLDivElement;
	dropArea: HTMLDivElement;
	main: HTMLCanvasElement;
}

interface Size {
	width: number;
	height: number;
	scaleRatio: number;
}
