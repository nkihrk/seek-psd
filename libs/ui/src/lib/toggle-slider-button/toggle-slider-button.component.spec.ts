import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleSliderButtonComponent } from './toggle-slider-button.component';

describe('ToggleSliderButtonComponent', () => {
  let component: ToggleSliderButtonComponent;
  let fixture: ComponentFixture<ToggleSliderButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleSliderButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleSliderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
