import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';

// Service
import { FileLoaderService } from '../../service/core/file-loader.service';
import { MemoryService } from '../../service/core/memory.service';
import { Psd, Layer } from 'ag-psd';
import * as _ from 'lodash';
import { LayerInfo } from '../../model/layer-info.model';
import { GpuService } from '../../service/core/gpu.service';
import { FuncService } from '../../service/core/func.service';
import { Pointer } from '../../model/pointer.model';
import { FlagService } from '../../service/core/flag.service';
import { CpuService } from '../../service/core/cpu.service';

// Fontawesome
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faEyeDropper } from '@fortawesome/free-solid-svg-icons';
import { faCropAlt } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-viewer',
	templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
	// div
	@ViewChild('psdViewer', { static: true }) psdViewerRef: ElementRef<HTMLDivElement>;
	@ViewChild('dropArea', { static: true }) dropAreaRef: ElementRef<HTMLDivElement>;
	@ViewChild('uiCanvasWrapper', { static: true }) uiCanvasWrapperRef: ElementRef<HTMLDivElement>;

	// canvas
	@ViewChild('mainCanvas', { static: true }) mainCanvasRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('uiCanvas', { static: true }) uiCanvasRef: ElementRef<HTMLCanvasElement>;

	// Fontawesome
	faFileImage = faFileImage;
	faSignature = faSignature;
	faEye = faEye;
	faEyeSlash = faEyeSlash;
	faAngleRight = faAngleRight;
	faFolder = faFolder;
	faDownload = faDownload;
	faEyeDropper = faEyeDropper;
	faCropAlt = faCropAlt;
	faSearch = faSearch;
	faTrashAlt = faTrashAlt;

	isLoading = false;

	constructor(
		private fileLoader: FileLoaderService,
		public memory: MemoryService,
		private changeDetectorRef: ChangeDetectorRef,
		private gpu: GpuService,
		private func: FuncService,
		private flag: FlagService,
		private cpu: CpuService
	) {}

	ngOnInit(): void {
		this.memory.initRenderer(
			this.psdViewerRef.nativeElement,
			this.dropAreaRef.nativeElement,
			this.uiCanvasWrapperRef.nativeElement,
			this.mainCanvasRef.nativeElement,
			this.uiCanvasRef.nativeElement
		);

		this.memory.psdData$.subscribe((data: { psd: Psd; fileName: string }) => {
			console.log(data);
			if (this.memory.layerInfos$.getValue().length > 0) return;

			const rendererSize: DOMRect = this.dropAreaRef.nativeElement.getBoundingClientRect();
			const width = rendererSize.width;
			const height = rendererSize.width * (data.psd.height / data.psd.width);
			const scaleRatio = rendererSize.width / data.psd.width;

			this.memory.updateRenderer(data.fileName, { width, height, scaleRatio }, data.psd, true);
			this.memory.updateLayerInfos(this._extractPsdData(data.psd));
			this.memory.updateFileName(data.fileName);

			// Render
			//this.gpu.render();
			this.gpu.reRender();

			// Set width and height for renderer
			setTimeout(() => {
				// 60px is due to the renderer set to padding: 30px;
				this.memory.renderer.element.psdViewer.style.maxHeight = height + 60 + 'px';
				this.memory.renderer.element.dropArea.classList.remove('active');
			}, 500);

			// Update views
			setTimeout(() => {
				this.changeDetectorRef.detectChanges();
			}, 1500);
		});
	}

	ngOnDestroy(): void {
		this.memory.psdData$.unsubscribe();
	}

	onFileDropped($fileList: File[]) {
		// Set loading
		this.isLoading = true;
		this.changeDetectorRef.detectChanges();

		this.fileLoader.onFileDropped($fileList);
	}

	onPointerEvent($pointerData: Pointer): void {
		this.flag.update($pointerData);
		this.cpu.update($pointerData);
	}

	async loadFile(): Promise<File[]> {
		if (this.memory.renderer.isLoaded) return;

		const fileList: File[] = await this.fileLoader.getFile();
		this.onFileDropped(fileList);
	}

	toggleVisibility($name: string, $uniqueId: string): void {
		this.gpu.toggleVisibility($name, $uniqueId);
		this.changeDetectorRef.detectChanges();
		this.gpu.reRender();
	}

	execFunc($name: string): void {
		// Initialize ui canvas
		const c: HTMLCanvasElement = this.memory.renderer.element.ui;
		c.width = 1;
		c.height = 1;

		if (this.memory.reservedByFunc$.getValue().current.name === $name) {
			// Initialize state and return
			this.memory.updateReservedByFunc({
				name: '',
				type: '',
				group: ''
			});
			return;
		}

		switch ($name) {
			case 'color-picker':
				this.func.colorPicker();
				break;

			case 'crop':
				this.func.crop();
				break;

			case 'zoom':
				this.func.zoom();
				break;

			case 'garbage':
				this._garbage();
				break;

			default:
				break;
		}
	}

	private _garbage(): void {
		this.memory.refreshData();

		// Initialize reservedByFuncs
		this.memory.updateReservedByFunc({
			name: '',
			type: '',
			group: ''
		});

		this.memory.renderer.element.dropArea.classList.add('active');
		this.isLoading = false;

		setTimeout(() => {
			this.memory.renderer.element.psdViewer.style.maxHeight = '300px';
		}, 400);

		setTimeout(() => {
			// Initialize main canvas
			const c: HTMLCanvasElement = this.memory.renderer.element.main;
			c.width = 1;
			c.height = 1;
		}, 1000);
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	Processing PSD data
	//
	///////////////////////////////////////////////////////////////////////////

	private _extractPsdData($psd: Psd): LayerInfo[] {
		const root: Layer[] = $psd.children;
		const list: LayerInfo[] = [];

		for (let i = root.length - 1; i > -1; i--) {
			const item: LayerInfo = {
				name: root[i].name,
				uniqueId: Math.random().toString(36).substr(2, 9),
				hidden: {
					current: root[i].hidden,
					prev: root[i].hidden
				},
				psd: root[i],
				children: []
			};

			list.push(item);
			this._getChildren(root[i], item, root[i].hidden);
		}

		return list;
	}

	private _getChildren($child: Layer, $item: LayerInfo, $isFolderHidden: boolean): void {
		if (!$child.children?.length) return;

		for (let i = $child.children.length - 1; i > -1; i--) {
			const item: LayerInfo = {
				name: $child.children[i].name,
				uniqueId: Math.random().toString(36).substr(2, 9),
				hidden: {
					current: $isFolderHidden ? true : $child.children[i].hidden,
					prev: $isFolderHidden ? true : $child.children[i].hidden
				},
				psd: $child.children[i],
				children: []
			};

			$item.children.push(item);

			this._getChildren($child.children[i], item, item.hidden.current);
		}
	}
}
