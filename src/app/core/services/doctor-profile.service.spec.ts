import { TestBed } from '@angular/core/testing';

import { DoctorProfileService } from './doctor-profile.service';
import { testProviders } from '../../../testing/test-providers';

describe('DoctorProfileService', () => {
  let service: DoctorProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(DoctorProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
