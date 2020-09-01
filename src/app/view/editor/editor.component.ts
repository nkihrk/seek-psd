import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileLoaderService } from '../../service/core/file-loader.service';
import { MemoryService } from '../../service/core/memory.service';
import { Psd } from 'ag-psd';
import * as _ from 'lodash';

// Fontawesome
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

interface LayerInfo {
	name: string;
	uniqueId: string;
	hidden: {
		current: boolean;
		prev: boolean;
	};
	psd: any;
	children: LayerInfo[];
}

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
	@ViewChild('psdViewer', { static: true }) psdViewerRef: ElementRef<HTMLDivElement>;
	@ViewChild('dropArea', { static: true }) dropAreaRef: ElementRef<HTMLDivElement>;
	@ViewChild('mainCanvas', { static: true }) mainCanvasRef: ElementRef<HTMLCanvasElement>;

	// Fontawesome
	faFileImage = faFileImage;
	faSignature = faSignature;
	faEye = faEye;
	faEyeSlash = faEyeSlash;
	faAngleRight = faAngleRight;
	faFolder = faFolder;

	psd: Psd;
	fileName: string;
	width: number;
	height: number;
	scaleRatio: number;

	infoList: LayerInfo[] = [];

	constructor(
		private fileLoader: FileLoaderService,
		private memory: MemoryService,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.memory.initRenderer(
			this.psdViewerRef.nativeElement,
			this.dropAreaRef.nativeElement,
			this.mainCanvasRef.nativeElement
		);

		this.memory.psdDataState.subscribe(
			(data: { psd: Psd; fileName: string; size: { width: number; height: number } }) => {
				console.log(data);

				this.psd = data.psd;
				this.fileName = data.fileName;

				const size: DOMRect = this.memory.renderer.dropArea.getBoundingClientRect();
				this.width = size.width;
				this.height = size.width * (data.psd.height / data.psd.width);
				this.scaleRatio = size.width / data.psd.width;

				this.infoList = this._extractPsdData(data.psd);

				// Render
				//this._render();
				this._reRender();

				// Set width and height for renderer
				setTimeout(() => {
					this.memory.renderer.psdViewer.style.maxHeight = this.height + 'px';
					this.memory.renderer.dropArea.classList.remove('active');
				}, 500);

				// Update views
				setTimeout(() => {
					this.changeDetectorRef.detectChanges();
				}, 1500);
			}
		);
	}

	toggleVisibility($name: string, $uniqueId: string): void {
		const root: LayerInfo[] = this.infoList;
		this.recursive(root, ($layer: LayerInfo) => {
			if ($name === $layer.name && $uniqueId === $layer.uniqueId) {
				// Folder layer
				if ($layer.children.length > 0) {
					if ($layer.hidden.current) {
						const root: LayerInfo[] = $layer.children;
						this.recursive(root, ($subLayer: LayerInfo) => {
							$subLayer.hidden.current = $subLayer.hidden.prev;
						});
					} else {
						const root: LayerInfo[] = $layer.children;
						this.recursive(root, ($subLayer: LayerInfo) => {
							$subLayer.hidden.prev = $subLayer.hidden.current;
							$subLayer.hidden.current = !$layer.hidden.current;
						});
					}
				}

				$layer.hidden.current = !$layer.hidden.current;

				this.changeDetectorRef.detectChanges();
				this._reRender();

				// To get rid of loop
				return 0;
			}
		});
	}

	private _render(): void {
		const c: HTMLCanvasElement = this.memory.renderer.main;
		c.width = this.width;
		c.height = this.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');
		const w: number = this.psd.width * this.scaleRatio;
		const h: number = this.psd.height * this.scaleRatio;

		ctx.drawImage(this.psd.canvas, 0, 0, w, h);
	}

	private _reRender(): void {
		const c: HTMLCanvasElement = this.memory.renderer.main;
		c.width = this.width;
		c.height = this.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		const root = this.infoList;
		this.recursive(root, ($layer: LayerInfo) => {
			const psd = $layer.psd;
			if ($layer.hidden.current || !psd?.canvas) return;

			const x: number = psd.left * this.scaleRatio;
			const y: number = psd.top * this.scaleRatio;
			const w: number = (psd.right - psd.left) * this.scaleRatio;
			const h: number = (psd.bottom - psd.top) * this.scaleRatio;

			ctx.save();
			// Set opacity
			ctx.globalAlpha = psd.opacity;

			// Blend mode
			if (psd.blendMode === 'overlay') {
				ctx.globalCompositeOperation = 'overlay';
			} else if (psd.blendMode === 'screen') {
				ctx.globalCompositeOperation = 'screen';
			} else if (psd.blendMode === 'multiply') {
				ctx.globalCompositeOperation = 'multiply';
			} else if (psd.blendMode === 'linear dodge') {
				ctx.globalCompositeOperation = 'lighter';
			} else if (psd.blendMode === 'soft light') {
				ctx.globalCompositeOperation = 'soft-light';
			}

			ctx.drawImage(psd.canvas, x, y, w, h);
			ctx.restore();
		});
	}

	private recursive($root: any[], $callback: Function): void {
		for (let i = $root.length - 1; i > -1; i--) {
			const state: number = $callback($root[i]);

			if (state === 0) return;

			if (!$root[i].children?.length) continue;
			this.recursive($root[i].children, $callback);
		}
	}

	onFileDropped($fileList: File[]) {
		this.fileLoader.onFileDropped($fileList);
	}

	private _extractPsdData($psd: Psd): LayerInfo[] {
		const root = $psd.children;
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

	private _getChildren($child: any, $item: LayerInfo, $isFolderHidden: boolean): void {
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
