import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Psd } from 'ag-psd';
import { LayerInfo } from '../../model/layer-info.model';

@Injectable({
	providedIn: 'root'
})
export class MemoryService {
	constructor() {}

	// Data stream
	psdData$: Subject<{ psd: Psd; fileName: string }> = new Subject();
	layerInfos$: BehaviorSubject<LayerInfo[]> = new BehaviorSubject([]);
	fileName$: BehaviorSubject<string> = new BehaviorSubject('');
	reservedByFunc$: BehaviorSubject<ReservedByFunc> = new BehaviorSubject({
		current: {
			name: '',
			type: '',
			group: ''
		},
		prev: {
			name: '',
			type: '',
			group: ''
		}
	});

	// Renderer
	renderer = { element: {} as Element, size: {} as Size } as Renderer;

	///////////////////////////////////////////////////////////////////////////
	//
	//	Public methods
	//
	///////////////////////////////////////////////////////////////////////////

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

	updateReservedByFunc($reserved: Reserved): void {
		const current: Reserved = this.reservedByFunc$.getValue().current;
		this.reservedByFunc$.next({
			current: $reserved,
			prev: current
		});
	}
}

interface ReservedByFunc {
	current: Reserved;
	prev: Reserved;
}

interface Reserved {
	name: string;
	type: string;
	group: string;
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
