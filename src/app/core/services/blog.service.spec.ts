import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { BlogService } from './blog.service';
import { testProviders } from '../../../testing/test-providers';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('reads the admin list from /BlogAdmin/Index (no /admin segment)', () => {
    service.getAdminAll(1, 10).subscribe();

    const request = httpMock.expectOne((req) => req.url.endsWith('/BlogAdmin/Index'));
    expect(request.request.method).toBe('GET');
    expect(request.request.url).not.toContain('/admin/');
    request.flush({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10 });
  });

  it('updates through PUT /BlogAdmin/Update/{id}', () => {
    service.update(5, { title: 't', description: 'd', bodyText: '<p>b</p>', isActive: true }).subscribe();

    const request = httpMock.expectOne((req) => req.url.endsWith('/BlogAdmin/Update/5'));
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      title: 't',
      description: 'd',
      bodyText: '<p>b</p>',
      isActive: true,
    });
    request.flush({});
  });

  it('deletes through DELETE /BlogAdmin/Delete/{id}', () => {
    service.delete(5).subscribe();

    const request = httpMock.expectOne((req) => req.url.endsWith('/BlogAdmin/Delete/5'));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
