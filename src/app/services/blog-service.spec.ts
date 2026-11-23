import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog-service';
import { testProviders } from '../../testing/test-providers';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
