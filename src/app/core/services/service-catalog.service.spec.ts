import { TestBed } from '@angular/core/testing';

import { ServiceCatalogService } from './service-catalog.service';
import { testProviders } from '../../../testing/test-providers';

describe('ServiceCatalogService', () => {
  let serviceService: ServiceCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    serviceService = TestBed.inject(ServiceCatalogService);
  });

  it('should be created', () => {
    expect(serviceService).toBeTruthy();
  });
});
