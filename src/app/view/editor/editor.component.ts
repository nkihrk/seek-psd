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
	visibility: boolean;
	children: LayerInfo[];
}

interface LayerData {
	name: string;
	hidden: boolean;
	blendMode: string;
	clipping: boolean;
	top: number;
	bottom: number;
	right: number;
	left: number;
	transparencyProtected: boolean;
	opacity: number;
	protected: { transparency: boolean; composite: boolean; position: boolean };
	canvas: HTMLCanvasElement;
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

	dataList: LayerData[] = [];
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

				this.dataList = [];
				this.infoList = this._extractPsdData(data.psd);

				// Render
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

	toggleVisibility($name: string): void {
		const id: number = _.findIndex(this.dataList, ['name', $name]);
		this.dataList[id].hidden = !this.dataList[id].hidden;

		this.changeDetectorRef.detectChanges();
		this._reRender();
	}

	private _reRender(): void {
		const c: HTMLCanvasElement = this.memory.renderer.main;
		c.width = this.width;
		c.height = this.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		for (let i = this.dataList.length - 1; i > -1; i--) {
			if (this.dataList[i].hidden || !this.dataList[i].canvas) continue;

			const x: number = this.dataList[i].left * this.scaleRatio;
			const y: number = this.dataList[i].top * this.scaleRatio;
			const w: number = (this.dataList[i].right - this.dataList[i].left) * this.scaleRatio;
			const h: number = (this.dataList[i].bottom - this.dataList[i].top) * this.scaleRatio;

			ctx.save();
			// Set opacity
			ctx.globalAlpha = this.dataList[i].opacity;

			// Blend mode
			if (this.dataList[i].blendMode === 'overlay') {
				ctx.globalCompositeOperation = 'overlay';
			} else if (this.dataList[i].blendMode === 'screen') {
				ctx.globalCompositeOperation = 'screen';
			} else if (this.dataList[i].blendMode === 'multiply') {
				ctx.globalCompositeOperation = 'multiply';
			} else if (this.dataList[i].blendMode === 'linear dodge') {
				ctx.globalCompositeOperation = 'color-dodge';
			}

			ctx.drawImage(this.dataList[i].canvas, x, y, w, h);
			ctx.restore();
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
				visibility: !root[i].hidden,
				children: []
			};

			list.push(item);
			this._getChildren(root[i], item);
		}

		return list;
	}

	private _getChildren($child: any, $item: LayerInfo): void {
		if (!$child.children?.length) {
			this.dataList.push($child);
			console.log($child.blendMode);
		} else {
			for (let i = $child.children.length - 1; i > -1; i--) {
				const item: LayerInfo = {
					name: $child.children[i].name,
					uniqueId: Math.random().toString(36).substr(2, 9),
					visibility: !$child.children[i].hidden,
					children: []
				};

				$item.children.push(item);
				this._getChildren($child.children[i], item);
			}
		}
	}
}
