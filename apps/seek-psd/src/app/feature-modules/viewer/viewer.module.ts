import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerRoutingModule } from './viewer-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { UiModule } from '@seek-psd/ui';

import { ViewerPageComponent } from './pages/viewer-page/viewer-page.component';
import { ToolsComponent } from './components/tools/tools.component';
import { LayersComponent } from './components/layers/layers.component';
import { RendererComponent } from './components/renderer/renderer.component';
import { CanvasComponent } from './components/renderer/components/canvas/canvas.component';
import { DarkModeComponent } from './components/dark-mode/dark-mode.component';

@NgModule({
  declarations: [
    ViewerPageComponent,
    ToolsComponent,
    LayersComponent,
    RendererComponent,
    CanvasComponent,
    DarkModeComponent,
  ],
  imports: [
    CommonModule,
    ViewerRoutingModule,
    FlexLayoutModule,
    SharedModule,
    UiModule,
  ],
})
export class ViewerModule {}
