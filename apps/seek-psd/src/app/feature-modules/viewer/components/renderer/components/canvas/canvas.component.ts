import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { setPixelPerfect } from '@seek-psd/utils';
import { Engine2D, Canvas, EVENT_TYPE } from '@seek-psd/engine2d';
import { Store } from '../../../../../../core/functions/store';
import { TestEvent } from '../../../../../../core/functions/modules/events/testEvent';
import { TestRenderer } from '../../../../../../core/functions/modules/renderers/testRenderer';

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

    // engine2d
    const canvasEntity = new Canvas(this.uiLayer.nativeElement);
    const eg = new Engine2D();
    eg.registerStore(new Store());
    eg.registerEvent(EVENT_TYPE.POINTER, new TestEvent());
    eg.registerRenderer(new TestRenderer());
    eg.init(canvasEntity);
    eg.start();
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
