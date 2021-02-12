import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerRoutingModule } from './viewer-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';

import { ViewerPageComponent } from './pages/viewer-page/viewer-page.component';
import { ToolsComponent } from './components/tools/tools.component';
import { LayersComponent } from './components/layers/layers.component';
import { RendererComponent } from './components/renderer/renderer.component';
import { CanvasComponent } from './components/renderer/components/canvas/canvas.component';

@NgModule({
  declarations: [
    ViewerPageComponent,
    ToolsComponent,
    LayersComponent,
    RendererComponent,
    CanvasComponent,
  ],
  imports: [CommonModule, ViewerRoutingModule, FlexLayoutModule, SharedModule],
})
export class ViewerModule {}
