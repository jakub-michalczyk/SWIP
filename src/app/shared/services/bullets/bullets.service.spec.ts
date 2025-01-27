import { TestBed } from '@angular/core/testing';

import { BulletsService } from './bullets.service';

describe('BulletsService', () => {
  let service: BulletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
