import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSliderButtonComponent } from './toggle-slider-button/toggle-slider-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ToggleSliderButtonComponent],
  exports: [ToggleSliderButtonComponent],
})
export class UiModule {}
