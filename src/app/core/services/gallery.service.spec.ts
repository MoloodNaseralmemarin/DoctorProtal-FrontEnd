import { TestBed } from '@angular/core/testing';

import { GalleryService } from './gallery.service';
import { testProviders } from '../../../testing/test-providers';

describe('GalleryService', () => {
  let service: GalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(GalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
