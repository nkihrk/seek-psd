import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Psd } from 'ag-psd';
import { LayerInfo } from '../../model/layer-info.model';
import { Flgs } from '../../model/flgs.model';
import { PointerOffset } from '../../model/pointer-offset.model';
import { Crop } from '../../model/crop.model';

@Injectable({
	providedIn: 'root'
})
export class MemoryService {
	constructor() {}

	// Data stream
	psdData$: Subject<{ psd: Psd; fileName: string }> = new Subject();
	layerInfos$: BehaviorSubject<LayerInfo[]> = new BehaviorSubject([]);
	fileName$: BehaviorSubject<string> = new BehaviorSubject('');
	isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
	isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
	isGrayscale$: BehaviorSubject<boolean> = new BehaviorSubject(false);
	isFlip$: BehaviorSubject<boolean> = new BehaviorSubject(false);
	isFixedCropResolution$: BehaviorSubject<boolean> = new BehaviorSubject(false);

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
	crop$: BehaviorSubject<Crop> = new BehaviorSubject({
		offset: {
			current: {
				x: 0,
				y: 0
			},
			prev: {
				x: 0,
				y: 0
			}
		},
		size: {
			width: 500,
			height: 500
		}
	});
	resizeCanvas$: BehaviorSubject<{ type: number; ratio: number }> = new BehaviorSubject({
		type: 0,
		ratio: 1
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
		$container: HTMLDivElement,
		$psdViewer: HTMLDivElement,
		$dropArea: HTMLDivElement,
		$screenCanvasWrapper: HTMLDivElement,
		$main: HTMLCanvasElement,
		$screen: HTMLCanvasElement,
		$overlay: HTMLCanvasElement
	): void {
		this.renderer.element.container = $container;
		this.renderer.element.psdViewer = $psdViewer;
		this.renderer.element.dropArea = $dropArea;
		this.renderer.element.screenCanvasWrapper = $screenCanvasWrapper;
		this.renderer.element.main = $main;
		this.renderer.element.screen = $screen;
		this.renderer.element.overlay = $overlay;

		// Create buffer for psd
		this.renderer.element.buffer = document.createElement('canvas');
	}

	updateRenderer($size: { width: number; height: number }, $psd: Psd): void {
		this.renderer.size = $size;
		this.renderer.psd = $psd;
	}

	updateLayerInfos($layerInfos: LayerInfo[]): void {
		this.layerInfos$.next($layerInfos);
	}

	updateFileName($name: string): void {
		this.fileName$.next($name);
	}

	updateIsLoaded($flg: boolean): void {
		this.isLoaded$.next($flg);
	}

	updateIsLoading($flg): void {
		this.isLoading$.next($flg);
	}

	refreshData(): void {
		this.updateRenderer(null, null);
		this.updateLayerInfos([]);
		this.updateFileName('');
		this.updateIsLoaded(false);

		this.updateIsGrayScale(false);
		this.updateIsFlip(false);
		this.updateResizeCanvas(0, 1);
		this.updateIsFixedCropResolution(false);
	}

	updateReservedByFunc($reserved: Reserved): void {
		const current: Reserved = this.reservedByFunc$.getValue().current;
		this.reservedByFunc$.next({
			current: $reserved,
			prev: current
		});
	}

	updateCrop($crop: Crop): void {
		this.crop$.next($crop);
	}

	updateIsGrayScale($flg: boolean): void {
		this.isGrayscale$.next($flg);
	}

	updateIsFlip($flg: boolean): void {
		this.isFlip$.next($flg);
	}

	updateResizeCanvas($type: number, $ratio: number): void {
		this.resizeCanvas$.next({
			type: $type,
			ratio: $ratio
		});
	}

	updateIsFixedCropResolution($flg: boolean): void {
		this.isFixedCropResolution$.next($flg);
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
	size: Size;
	psd: Psd;
}

interface Element {
	// div
	container: HTMLDivElement;
	psdViewer: HTMLDivElement;
	dropArea: HTMLDivElement;
	screenCanvasWrapper: HTMLDivElement;
	// canvas
	main: HTMLCanvasElement;
	screen: HTMLCanvasElement;
	overlay: HTMLCanvasElement;
	buffer: HTMLCanvasElement;
}

interface Size {
	width: number;
	height: number;
}
