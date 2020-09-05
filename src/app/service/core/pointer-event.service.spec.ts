import { TestBed } from '@angular/core/testing';

import { PointerEventService } from './pointer-event.service';

describe('PointerEventService', () => {
  let service: PointerEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointerEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
