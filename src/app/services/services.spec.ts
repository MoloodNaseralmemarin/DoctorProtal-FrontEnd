import { TestBed } from '@angular/core/testing';

import { Service } from './services';
import { testProviders } from '../../testing/test-providers';

describe('Services', () => {
  let serviceService: Service;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    serviceService = TestBed.inject(Service);
  });

  it('should be created', () => {
    expect(serviceService).toBeTruthy();
  });
});
