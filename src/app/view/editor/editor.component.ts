import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileLoaderService } from '../../service/core/file-loader.service';
import { MemoryService } from '../../service/core/memory.service';

// Fontawesome
import { faFileImage } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
	@ViewChild('psdViewer', { static: true }) psdViewerRef: ElementRef<HTMLDivElement>;
	@ViewChild('dropArea', { static: true }) dropAreaRef: ElementRef<HTMLDivElement>;
	@ViewChild('mainCanvas', { static: true }) mainCanvasRef: ElementRef<HTMLCanvasElement>;

	faFileImage = faFileImage;

	constructor(private fileLoader: FileLoaderService, private memory: MemoryService) {}

	ngOnInit(): void {
		this.memory.initRenderer(
			this.psdViewerRef.nativeElement,
			this.dropAreaRef.nativeElement,
			this.mainCanvasRef.nativeElement
		);
	}

	onFileDropped($fileList: File[]) {
		this.fileLoader.onFileDropped($fileList);
	}
}
