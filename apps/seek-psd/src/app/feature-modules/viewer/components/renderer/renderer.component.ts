import { Component, OnInit } from '@angular/core';
import { Layers } from './components/canvas/canvas.component';

@Component({
  selector: 'seek-psd-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.scss'],
})
export class RendererComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  getLayers($event: Layers): void {
    console.log($event);
  }
}
