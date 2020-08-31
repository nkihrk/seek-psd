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
	children: any[];
}

interface LayerData {
	title: string;
	visibility: boolean;
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

	fileName: string;

	infoList: LayerInfo[] = [];
	dataList: LayerData[] = [];

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

		this.memory.psdDataState.subscribe((data: { psd; fileName: string }) => {
			console.log(data);
			this.fileName = data.fileName;
			this.infoList = this._extractPsdData(data.psd);

			setTimeout(() => {
				this.changeDetectorRef.detectChanges();
			}, 1500);
		});
	}

	toggleVisibility($title: string): void {
		const id: number = _.findIndex(this.dataList, ['title', $title]);
		console.log(this.dataList[id]);
	}

	onFileDropped($fileList: File[]) {
		this.fileLoader.onFileDropped($fileList);
	}

	private _extractPsdData($psd: Psd): LayerInfo[] {
		const root = $psd.children;
		const list: LayerInfo[] = [];

		for (let i = root.length - 1; i > 0; i--) {
			const item: LayerInfo = {
				title: root[i].name,
				uniqueId: Math.random().toString(36).substr(2, 9),
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
				visibility: true,
				canvas: $child.canvas
			};

			this.dataList.push(dataItem);

			if ($child.name === 'キャラ') console.log($child);
		} else {
			for (let i = $child.children.length - 1; i > 0; i--) {
				const item: LayerInfo = {
					title: $child.children[i].name,
					uniqueId: Math.random().toString(36).substr(2, 9),
					children: []
				};

				$item.children.push(item);
				this._getChildren($child.children[i], item);
			}
		}
	}
}
