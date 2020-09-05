import { TestBed } from '@angular/core/testing';

import { FuncService } from './func.service';

describe('FuncService', () => {
  let service: FuncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
