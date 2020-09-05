import { TestBed } from '@angular/core/testing';

import { CpuService } from './cpu.service';

describe('CpuService', () => {
  let service: CpuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
