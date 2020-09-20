import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

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
import { ValidateFormatService } from '../../service/util/validate-format.service';

// Module
import { CropService } from '../../service/module/crop.service';

// Fontawesome
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { faEyeDropper } from '@fortawesome/free-solid-svg-icons';
import { faCropAlt } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { faPaintRoller } from '@fortawesome/free-solid-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-viewer',
	templateUrl: './viewer.component.html',
	styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
	// div
	@ViewChild('container', { static: true }) containerRef: ElementRef<HTMLDivElement>;
	@ViewChild('psdViewer', { static: true }) psdViewerRef: ElementRef<HTMLDivElement>;
	@ViewChild('dropArea', { static: true }) dropAreaRef: ElementRef<HTMLDivElement>;
	@ViewChild('screenCanvasWrapper', { static: true }) screenCanvasWrapperRef: ElementRef<HTMLDivElement>;

	// canvas
	@ViewChild('mainCanvas', { static: true }) mainCanvasRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('screenCanvas', { static: true }) screenCanvasRef: ElementRef<HTMLCanvasElement>;
	@ViewChild('overlayCanvas', { static: true }) overlayCanvasRef: ElementRef<HTMLCanvasElement>;

	cropConf: FormGroup;

	// tcontainer's default max-width.
	// Make sure to change this value when $max-width in scss has been changed
	private defaultContainerWidth = 1200;

	private prevResizeCanvasId = 0;

	// Fontawesome
	faFileImage = faFileImage;
	faSignature = faSignature;
	faEye = faEye;
	faEyeSlash = faEyeSlash;
	faAngleRight = faAngleRight;
	faFolder = faFolder;
	faFileDownload = faFileDownload;
	faEyeDropper = faEyeDropper;
	faCropAlt = faCropAlt;
	faSearch = faSearch;
	faTrashAlt = faTrashAlt;
	faLock = faLock;
	faUnlock = faUnlock;
	faUndo = faUndo;
	faPaintRoller = faPaintRoller;
	faExchangeAlt = faExchangeAlt;
	faDownload = faDownload;
	faExpandAlt = faExpandAlt;

	constructor(
		private fileLoader: FileLoaderService,
		public memory: MemoryService,
		private changeDetectorRef: ChangeDetectorRef,
		private gpu: GpuService,
		private func: FuncService,
		private flag: FlagService,
		private cpu: CpuService,
		private cropModule: CropService,
		private validateFormat: ValidateFormatService,
		private notifier: NotifierService
	) {}

	ngOnInit(): void {
		this.memory.initRenderer(
			this.containerRef.nativeElement,
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
			this.memory.updateIsLoaded(true);

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
		if (this.memory.isLoaded$.getValue()) {
			this.notifier.notify('error', 'すでにファイルが読み込まれています');
			return;
		}

		this.memory.updateIsLoading(true);
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
				this.func.activateColorPicker();
				break;

			case 'crop':
				this.func.activateCrop();
				break;

			case 'zoom':
				this.func.activateZoom();
				break;

			case 'garbage':
				this.func.garbage();
				this.memory.updateIsLoading(false);
				break;

			default:
				break;
		}
	}

	execExplicitFunc($name: string): void {
		switch ($name) {
			case 'crop':
				this.func.crop();
				break;

			case 'grayscale':
				this.func.grayscale();
				break;

			case 'flip':
				this.func.flip();
				break;

			case 'resize-canvas':
				this.func.resizeCanvas();
				break;

			case 'download':
				this.func.download();
				break;

			default:
				break;
		}
	}

	///////////////////////////////////////////////////////////////////////////
	//
	//	resize canvas
	//
	///////////////////////////////////////////////////////////////////////////

	execResizeCanvas($id: number): void {
		if (this.prevResizeCanvasId === $id) return;
		// 0 : x1
		// 1 : x1.2
		// 2 : x1.4
		// 3 : x1.6
		// 4 : x1.8
		// 5 : x2

		let ratio = 1;
		if ($id === 0) {
			ratio = 1;
		} else if ($id === 1) {
			ratio = 1.2;
		} else if ($id === 2) {
			ratio = 1.4;
		} else if ($id === 3) {
			ratio = 1.6;
		} else if ($id === 4) {
			ratio = 1.8;
		} else if ($id === 5) {
			ratio = 2;
		}

		// Update state
		this.memory.updateResizeCanvas(true, $id, ratio);

		// Set scaled size
		this.containerRef.nativeElement.style.maxWidth = this.defaultContainerWidth * ratio + 'px';
		// 60px is padding-top and padding-bottom
		// 2px is border-width
		const aspect: number = this.memory.renderer.psd.height / this.memory.renderer.psd.width;
		// This calcuration is the same as calc(97% - 300px) in scss
		this.memory.renderer.element.psdViewer.style.maxHeight =
			(this.defaultContainerWidth * ratio * 0.97 - 300) * aspect + 'px';

		// To tell cropFunc that the resizeCanvas is executed
		this.memory.updateCrop(this.memory.crop$.getValue());

		// Store current $id to prevent recursive execution of this function
		this.prevResizeCanvasId = $id;

		setTimeout(() => {
			// Rerender
			this.gpu.reRender();
		}, 500);
	}

	toggleFixedResizeResolution(): void {
		const flg: boolean = this.memory.fixedResizeResolution$.getValue();
		this.memory.updateFixedResizeResolution(!flg);
	}

	rotateResolution(): void {}

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
