import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotifierModule } from 'angular-notifier';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewerComponent } from './view/viewer/viewer.component';
import { PreventHoverPropagationDirective } from './directive/prevent-hover-propagation.directive';
import { FileEventDirective } from './directive/file-event.directive';
import { PointerEventDirective } from './directive/pointer-event.directive';

@NgModule({
	declarations: [
		AppComponent,
		ViewerComponent,
		PreventHoverPropagationDirective,
		FileEventDirective,
		PointerEventDirective
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
		ReactiveFormsModule,
		NotifierModule.withConfig({
			position: {
				horizontal: {
					position: 'right',
					distance: 20
				},
				vertical: {
					position: 'top',
					distance: 20,
					gap: 10
				}
			}
		})
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
