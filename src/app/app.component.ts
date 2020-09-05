import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.scss',
		'../../node_modules/angular-notifier/styles/core.scss',
		'../../node_modules/angular-notifier/styles/themes/theme-material.scss',
		'../../node_modules/angular-notifier/styles/types/type-default.scss',
		'../../node_modules/angular-notifier/styles/types/type-error.scss',
		'../../node_modules/angular-notifier/styles/types/type-info.scss',
		'../../node_modules/angular-notifier/styles/types/type-success.scss',
		'../../node_modules/angular-notifier/styles/types/type-warning.scss'
	],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	title = 'seek-psd';
}
