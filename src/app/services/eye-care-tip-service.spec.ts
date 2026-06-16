import { TestBed } from '@angular/core/testing';

import { EyeCareTipService } from './eye-care-tip-service';

describe('EyeCareTipService', () => {
  let service: EyeCareTipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EyeCareTipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
