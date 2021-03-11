import type { IRenderTargetSet } from '@seek-psd/psd-renderer';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { setPixelPerfect } from '@seek-psd/utils';
import { PsdRenderer } from '@seek-psd/psd-renderer';
import { fromWorker } from 'observable-webworker';
import { of } from 'rxjs';

export interface Layers {
  psdLayer: ElementRef<HTMLCanvasElement>;
  uiLayer: ElementRef<HTMLCanvasElement>;
}

@Component({
  selector: 'seek-psd-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  @ViewChild('layer', { static: true })
  layer: ElementRef<HTMLDivElement>;
  @ViewChild('psdLayer', { static: true })
  psdLayer: ElementRef<HTMLCanvasElement>;
  @ViewChild('uiLayer', { static: true })
  uiLayer: ElementRef<HTMLCanvasElement>;

  @Output() emitLayers = new EventEmitter<Layers>();

  private renderTargetSets: IRenderTargetSet[] = [];

  constructor() {}

  ngOnInit(): void {
    // init canvas sizes with a appropriate pixel ratio
    this._initCanvas();

    const psd = new PsdRenderer();
    psd.init(this.layer.nativeElement);

    // add render targets
    const renderTargetSets: IRenderTargetSet[] = [
      {
        renderTargetName: 'psdLayer',
        renderTarget: this.psdLayer.nativeElement,
      },
      {
        renderTargetName: 'uiLayer',
        renderTarget: this.uiLayer.nativeElement,
      },
    ];
    renderTargetSets.forEach((e) => psd.registerRenderTargetSet(e));

    // start rendering
    psd.start();

    // pass layers to the parent component
    this._emitLayers();

    this._testWorker();
  }

  private _emitLayers(): void {
    const layers: Layers = {
      psdLayer: this.psdLayer,
      uiLayer: this.uiLayer,
    };

    this.emitLayers.emit(layers);
  }

  private _initCanvas(): void {
    setPixelPerfect(this.psdLayer.nativeElement, this._render);
    setPixelPerfect(this.uiLayer.nativeElement, this._render);
  }

  private _render($canvas: HTMLCanvasElement): void {
    //console.log($canvas);
  }

  private _testWorker(): void {
    if (typeof Worker !== 'undefined') {
      const input$ = of('Hello from main thread');

      fromWorker<string, string>(
        () => new Worker('./render-psd.worker', { type: 'module' }),
        input$
      ).subscribe((message) => {
        console.log(message); // Outputs 'Hello from webworker'
      });
    } else {
      console.warn('Web worker is not supported in this browser.');
    }
  }
}
