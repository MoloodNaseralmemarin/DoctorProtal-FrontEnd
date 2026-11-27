import { TestBed } from '@angular/core/testing';

import { FooterService } from './footer.service';
import { testProviders } from '../../../testing/test-providers';

describe('FooterService', () => {
  let service: FooterService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(FooterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
