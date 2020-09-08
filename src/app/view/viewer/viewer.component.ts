import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Service
import { FileLoaderService } from '../../service/core/file-loader.service';
import { MemoryService } from '../../service/core/memory.service';
import { Psd, Layer } from 'ag-psd';
import * as _ from 'lodash';
import { LayerInfo } from '../../model/layer-info.model';
import { GpuService } from '../../service/core/gpu.service';
import { FuncService } from '../../service/core/func.service';
import { Pointer } from '../../model/pointer.model';
import { Crop } from '../../model/crop.model';
import { FlagService } from '../../service/core/flag.service';
import { CpuService } from '../../service/core/cpu.service';

// Module
import { CropService } from '../../service/module/crop.service';

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
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-viewer',
	templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
	// div
	@ViewChild('psdViewer', { static: true }) psdViewerRef: ElementRef<HTMLDivElement>;
	@ViewChild('dropArea', { static: true }) dropAreaRef: ElementRef<HTMLDivElement>;
	@ViewChild('screenCanvasWrapper', { static: true }) screenCanvasWrapperRef: ElementRef<HTMLDivElement>;

	// canvas
	@ViewChild('mainCanvas', { static: true }) mainCanvasRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('screenCanvas', { static: true }) screenCanvasRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('overlayCanvas', { static: true }) overlayCanvasRef: ElementRef<HTMLCanvasElement>;

	cropConf: FormGroup;

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
	faLock = faLock;
	faUnlock = faUnlock;
	faUndo = faUndo;

	isLoading = false;

	constructor(
		private fileLoader: FileLoaderService,
		public memory: MemoryService,
		private changeDetectorRef: ChangeDetectorRef,
		private gpu: GpuService,
		private func: FuncService,
		private flag: FlagService,
		private cpu: CpuService,
		private cropModule: CropService
	) {}

	ngOnInit(): void {
		this.memory.initRenderer(
			this.psdViewerRef.nativeElement,
			this.dropAreaRef.nativeElement,
			this.screenCanvasWrapperRef.nativeElement,
			this.mainCanvasRef.nativeElement,
			this.screenCanvasRef.nativeElement,
			this.overlayCanvasRef.nativeElement
		);

		this.cropConf = new FormGroup({
			width: new FormControl('', []),
			height: new FormControl('', [])
		});

		this.cropConf.valueChanges.subscribe(($val) => {
			const crop: Crop = {
				offset: this.memory.crop$.getValue().offset,
				size: {
					width: $val.width,
					height: $val.height
				}
			};

			this.cropModule.validateInput(crop);
		});

		this.memory.psdData$.subscribe((data: { psd: Psd; fileName: string }) => {
			console.log(data);
			if (this.memory.isLoaded$.getValue()) return;

			const canvasSize: DOMRect = this.mainCanvasRef.nativeElement.getBoundingClientRect();
			const width = canvasSize.width;
			const height = Math.floor(canvasSize.width * (data.psd.height / data.psd.width));
			const scaleRatio = canvasSize.width / data.psd.width;

			this.memory.updateRenderer({ width, height, scaleRatio }, data.psd);
			this.memory.updateLayerInfos(this._extractPsdData(data.psd));
			this.memory.updateFileName(data.fileName);
			this.memory.updateLoadedState(true);

			const crop: Crop = {
				offset: {
					current: {
						x: width / 2,
						y: height / 2
					},
					prev: {
						x: width / 2,
						y: height / 2
					}
				},
				size: {
					width,
					height
				}
			};
			this.memory.updateCrop(crop);

			// Render
			//this.gpu.render();
			this.gpu.reRender();

			// Set width and height for renderer
			setTimeout(() => {
				// 60px is due to the psdViewer set to padding: 30px;
				// 2px is due to the psdViewer's border-width set to 1px, which is border: solid 1px $color;
				this.memory.renderer.element.psdViewer.style.maxHeight = height + 60 + 2 + 'px';
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
		if (this.memory.isLoaded$.getValue()) return;

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
		const screen: HTMLCanvasElement = this.memory.renderer.element.screen;
		screen.width = 1;
		screen.height = 1;
		const overlay: HTMLCanvasElement = this.memory.renderer.element.overlay;
		overlay.width = 1;
		overlay.height = 1;

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
	//	Crop
	//
	///////////////////////////////////////////////////////////////////////////

	crop(): void {
		console.log(this.cropConf.controls['width'].value, this.cropConf.controls['height'].value);
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
					prev: !root[i].hidden
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
					prev: $isFolderHidden ? false : !$child.children[i].hidden
				},
				psd: $child.children[i],
				children: []
			};

			$item.children.push(item);

			this._getChildren($child.children[i], item, item.hidden.current);
		}
	}
}
