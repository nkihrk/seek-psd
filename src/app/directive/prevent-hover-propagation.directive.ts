import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appPreventHoverPropagation]'
})
export class PreventHoverPropagationDirective {
	constructor() {}

	@HostListener('pointerover', ['$event']) onPointerOver($e) {
		$e.stopPropagation();
		$e.target.classList.add('active');
	}

	@HostListener('pointerout', ['$event']) onPointerOut($e) {
		$e.stopPropagation();
		$e.target.classList.remove('active');
	}
}
