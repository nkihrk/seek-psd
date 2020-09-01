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
	title: string;
	uniqueId: string;
	visibility: boolean;
	children: LayerInfo[];
}

interface LayerData {
	title: string;
	visibility: boolean;
	canvas: HTMLCanvasElement;
	size: {
		width: number;
		height: number;
	};
	offset: {
		x: number;
		y: number;
	};
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
				this.width = data.size.width;
				this.height = data.size.height;
				this.scaleRatio = data.size.width / data.psd.width;
				this.dataList = [];
				this.infoList = this._extractPsdData(data.psd);

				// Render
				this._reRender();

				// Update views
				setTimeout(() => {
					this.changeDetectorRef.detectChanges();
				}, 1500);
			}
		);
	}

	toggleVisibility($title: string): void {
		const id: number = _.findIndex(this.dataList, ['title', $title]);
		this.dataList[id].visibility = !this.dataList[id].visibility;
		console.log(this.dataList[id]);

		this.changeDetectorRef.detectChanges();
		this._reRender();
	}

	private _reRender(): void {
		const c: HTMLCanvasElement = this.memory.renderer.main;
		c.width = this.width;
		c.height = this.height;
		const ctx: CanvasRenderingContext2D = c.getContext('2d');

		for (let i = this.dataList.length - 1; i > -1; i--) {
			const x: number = this.dataList[i].offset.x * this.scaleRatio;
			const y: number = this.dataList[i].offset.y * this.scaleRatio;
			const w: number = this.dataList[i].size.width * this.scaleRatio;
			const h: number = this.dataList[i].size.height * this.scaleRatio;
			if (this.dataList[i].visibility) ctx.drawImage(this.dataList[i].canvas, x, y, w, h);
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
				title: root[i].name,
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
			const dataItem: LayerData = {
				title: $child.name,
				visibility: !$child.hidden,
				canvas: $child.canvas,
				size: {
					width: $child.right - $child.left,
					height: $child.bottom - $child.top
				},
				offset: {
					x: $child.left,
					y: $child.top
				}
			};

			this.dataList.push(dataItem);
		} else {
			for (let i = $child.children.length - 1; i > -1; i--) {
				const item: LayerInfo = {
					title: $child.children[i].name,
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
