import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileLoaderService } from '../../service/core/file-loader.service';
import { MemoryService } from '../../service/core/memory.service';
import { Psd } from 'ag-psd';

// Fontawesome
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

interface LayerInfo {
	title: string;
	children: any[];
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
	faEye = faEye;

	fileName: string;

	list: LayerInfo[] = [];

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
			this.list = this._extractPsdData(data.psd);

			setTimeout(() => {
				this.changeDetectorRef.detectChanges();
			}, 1500);
		});
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
				children: []
			};

			list.push(item);
			this._getChildren(root[i], item);
		}

		return list;
	}

	private _getChildren($child: any, $item: LayerInfo): void {
		if (!$child.children?.length) return;

		for (let i = $child.children.length - 1; i > 0; i--) {
			const item: LayerInfo = {
				title: $child.children[i].name,
				children: []
			};

			$item.children.push(item);
			this._getChildren($child.children[i], item);
		}
	}
}
