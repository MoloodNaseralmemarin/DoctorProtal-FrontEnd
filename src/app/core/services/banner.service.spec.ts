import { TestBed } from '@angular/core/testing';

import { BannerService } from './banner.service';
import { testProviders } from '../../../testing/test-providers';

describe('Banner', () => {
  let service: BannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(BannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
