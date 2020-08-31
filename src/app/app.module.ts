import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './view/editor/editor.component';
import { EventDirective } from './directive/event.directive';

@NgModule({
	declarations: [AppComponent, EditorComponent, EventDirective],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
