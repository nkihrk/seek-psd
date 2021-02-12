import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerPageComponent } from './pages/viewer-page/viewer-page.component';
import { ToolsComponent } from './components/tools/tools.component';
import { LayersComponent } from './components/layers/layers.component';
import { RendererComponent } from './components/renderer/renderer.component';

@NgModule({
  declarations: [
    ViewerPageComponent,
    ToolsComponent,
    LayersComponent,
    RendererComponent,
  ],
  imports: [CommonModule, ViewerRoutingModule],
})
export class ViewerModule {}
