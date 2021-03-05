import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { setPixelPerfect } from '@seek-psd/utils';
import { SeekPsd } from '@seek-psd/psd';

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

  constructor() {}

  ngOnInit(): void {
    // pass layers to the parent component
    this._emitLayers();

    // init canvas sizes with a appropriate pixel ratio
    this._initCanvas();

    const psd = new SeekPsd();
    psd.init(this.layer.nativeElement);
    psd.start();
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
}
