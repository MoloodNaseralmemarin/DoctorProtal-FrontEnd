import { TestBed } from '@angular/core/testing';

import { EyeCareTipService } from './eye-care-tip.service';
import { testProviders } from '../../../testing/test-providers';

describe('EyeCareTipService', () => {
  let service: EyeCareTipService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(EyeCareTipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
