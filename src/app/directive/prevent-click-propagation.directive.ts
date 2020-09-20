import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appPreventClickPropagation]'
})
export class PreventClickPropagationDirective {
	constructor() {}

	@HostListener('click', ['$event']) onPointerOver($e) {
		$e.stopPropagation();
	}
}
