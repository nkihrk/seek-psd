import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './view/editor/editor.component';
import { EventDirective } from './directive/event.directive';
import { PreventHoverPropagationDirective } from './directive/prevent-hover-propagation.directive';

@NgModule({
	declarations: [AppComponent, EditorComponent, EventDirective, PreventHoverPropagationDirective],
	imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
