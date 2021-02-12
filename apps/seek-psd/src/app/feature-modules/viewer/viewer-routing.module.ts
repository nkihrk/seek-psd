import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewerPageComponent } from './components/viewer-page/viewer-page.component';

const routes: Routes = [{ path: '', component: ViewerPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewerRoutingModule {}
