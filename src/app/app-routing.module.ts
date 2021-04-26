import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewerComponent } from './view/viewer/viewer.component';

const routes: Routes = [
	{ path: '', redirectTo: '/viewer', pathMatch: 'full' },
	{ path: 'viewer', component: ViewerComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
