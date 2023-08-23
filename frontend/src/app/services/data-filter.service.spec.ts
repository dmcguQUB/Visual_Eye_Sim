import { TestBed } from '@angular/core/testing';

import { DataFilterService } from './data-filter.service';

describe('DataFilterService', () => {
  let service: DataFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
