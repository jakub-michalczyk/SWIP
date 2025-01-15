import { TestBed } from '@angular/core/testing';

import { StandaloneService } from './standalone.service';

describe('StandaloneService', () => {
  let service: StandaloneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandaloneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
