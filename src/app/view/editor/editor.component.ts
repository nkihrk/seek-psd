import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileLoaderService } from '../../service/core/file-loader.service';
import { MemoryService } from '../../service/core/memory.service';
import { Psd } from 'ag-psd';
import * as _ from 'lodash';
import { LayerInfo } from '../../model/layer-info.model';
import { GpuService } from '../../service/core/gpu.service';

// Fontawesome
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

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

	constructor(
		private fileLoader: FileLoaderService,
		public memory: MemoryService,
		private changeDetectorRef: ChangeDetectorRef,
		private gpu: GpuService
	) {}

	ngOnInit(): void {
		this.memory.initRenderer(
			this.psdViewerRef.nativeElement,
			this.dropAreaRef.nativeElement,
			this.mainCanvasRef.nativeElement
		);

		this.memory.psdData$.subscribe((data: { psd: Psd; fileName: string }) => {
			console.log(data);

			const rendererSize: DOMRect = this.dropAreaRef.nativeElement.getBoundingClientRect();
			const width = rendererSize.width;
			const height = rendererSize.width * (data.psd.height / data.psd.width);
			const scaleRatio = rendererSize.width / data.psd.width;

			this.memory.updateRenderer(data.fileName, { width, height, scaleRatio }, data.psd);
			this.memory.updateLayerInfos(this._extractPsdData(data.psd));
			this.memory.updateFileName(data.fileName);

			// Render
			//this.gpu.render();
			this.gpu.reRender();

			// Set width and height for renderer
			setTimeout(() => {
				this.memory.renderer.element.psdViewer.style.maxHeight = height + 'px';
				this.memory.renderer.element.dropArea.classList.remove('active');
			}, 500);

			// Update views
			setTimeout(() => {
				this.changeDetectorRef.detectChanges();
			}, 1500);
		});
	}

	toggleVisibility($name: string, $uniqueId: string): void {
		this.gpu.toggleVisibility($name, $uniqueId);
		this.changeDetectorRef.detectChanges();
		this.gpu.reRender();
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
