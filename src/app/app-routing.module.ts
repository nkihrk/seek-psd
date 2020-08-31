import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorComponent } from './view/editor/editor.component';

const routes: Routes = [
	{ path: '', redirectTo: '/editor', pathMatch: 'full' },
	{ path: 'editor', component: EditorComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
