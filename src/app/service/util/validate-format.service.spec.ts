import { TestBed } from '@angular/core/testing';

import { ValidateFormatService } from './validate-format.service';

describe('ValidateFormatService', () => {
  let service: ValidateFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
