import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerPageComponent } from './components/viewer-page/viewer-page.component';

@NgModule({
  declarations: [ViewerPageComponent],
  imports: [CommonModule, ViewerRoutingModule],
})
export class ViewerModule {}
