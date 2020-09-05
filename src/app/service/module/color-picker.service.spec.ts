import { TestBed } from '@angular/core/testing';

import { ColorPickerService } from './color-picker.service';

describe('ColorPickerService', () => {
  let service: ColorPickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorPickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
