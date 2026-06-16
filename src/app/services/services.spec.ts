import { TestBed } from '@angular/core/testing';

import { Service } from './services';

describe('Services', () => {
  let serviceService: Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    serviceService = TestBed.inject(Service);
  });

  it('should be created', () => {
    expect(serviceService).toBeTruthy();
  });
});
