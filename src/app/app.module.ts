import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotifierModule } from 'angular-notifier';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewerComponent } from './view/viewer/viewer.component';
import { EventDirective } from './directive/event.directive';
import { PreventHoverPropagationDirective } from './directive/prevent-hover-propagation.directive';

@NgModule({
	declarations: [AppComponent, ViewerComponent, EventDirective, PreventHoverPropagationDirective],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
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
