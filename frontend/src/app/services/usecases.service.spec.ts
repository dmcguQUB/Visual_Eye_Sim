import { TestBed } from '@angular/core/testing';

import { UsecasesService } from './usecases.service';

describe('UsecasesService', () => {
  let service: UsecasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsecasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
