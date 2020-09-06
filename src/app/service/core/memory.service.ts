import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Psd } from 'ag-psd';
import { LayerInfo } from '../../model/layer-info.model';
import { Flgs } from '../../model/flgs.model';
import { PointerOffset } from '../../model/pointer-offset.model';

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

	// Flags
	flgs: Flgs = {
		downFlg: false,
		// - Similarly to mousedown events
		leftDownFlg: false,
		middleDownFlg: false,
		rightDownFlg: false,
		// - Similarly to mouseup events
		leftUpFlg: false,
		middleUpFlg: false,
		rightUpFlg: false,
		// - Similarly to mousedown + mousemove events
		leftDownMoveFlg: false,
		middleDownMoveFlg: false,
		rightDownMoveFlg: false
	};

	// Pointer offsets
	pointerOffset: PointerOffset = {
		current: {
			x: -Infinity,
			y: -Infinity
		},
		prev: {
			x: -Infinity,
			y: -Infinity
		},
		raw: {
			x: -Infinity,
			y: -Infinity
		},
		tmp: {
			x: -Infinity,
			y: -Infinity
		}
	};

	///////////////////////////////////////////////////////////////////////////
	//
	//	Public methods
	//
	///////////////////////////////////////////////////////////////////////////

	initRenderer(
		$psdViewer: HTMLDivElement,
		$dropArea: HTMLDivElement,
		$uiCanvasWrapper: HTMLDivElement,
		$main: HTMLCanvasElement,
		$ui: HTMLCanvasElement
	): void {
		this.renderer.element.psdViewer = $psdViewer;
		this.renderer.element.dropArea = $dropArea;
		this.renderer.element.uiCanvasWrapper = $uiCanvasWrapper;
		this.renderer.element.main = $main;
		this.renderer.element.ui = $ui;
		this.renderer.isLoaded = false;
	}

	updateRenderer(
		$fileName: string,
		$size: { width: number; height: number; scaleRatio: number },
		$psd: Psd,
		$isLoaded: boolean
	): void {
		this.renderer.fileName = $fileName;
		this.renderer.size = $size;
		this.renderer.psd = $psd;
		this.renderer.isLoaded = $isLoaded;
	}

	updateLayerInfos($layerInfos: LayerInfo[]): void {
		this.layerInfos$.next($layerInfos);
	}

	updateFileName($name: string): void {
		this.fileName$.next($name);
	}

	refreshData(): void {
		this.updateRenderer('', null, null, false);
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
	isLoaded: boolean;
}

interface Element {
	// div
	psdViewer: HTMLDivElement;
	dropArea: HTMLDivElement;
	uiCanvasWrapper: HTMLDivElement;
	// canvas
	main: HTMLCanvasElement;
	ui: HTMLCanvasElement;
}

interface Size {
	width: number;
	height: number;
	scaleRatio: number;
}
