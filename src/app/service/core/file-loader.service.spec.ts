import { TestBed } from '@angular/core/testing';

import { FileLoaderService } from './file-loader.service';

describe('FileLoaderService', () => {
  let service: FileLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
