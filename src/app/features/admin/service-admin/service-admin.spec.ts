import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { AdminServiceComponent } from './service-admin';
import { testProviders } from '../../../../testing/test-providers';

const page = {
  items: [
    { id: 7, title: 'جراحی آب مروارید', description: '<p>توضیح</p>', isActive: true },
  ],
  pageNumber: 1,
  pageSize: 100,
  totalCount: 1,
  totalPages: 1,
};

describe('AdminServiceComponent', () => {
  let component: AdminServiceComponent;
  let fixture: ComponentFixture<AdminServiceComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServiceComponent],
      providers: testProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminServiceComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('loads the admin list from the ServiceAdmin route', () => {
    fixture.detectChanges();

    const request = httpMock.expectOne((req) => req.url.endsWith('/ServiceAdmin/Index'));
    expect(request.request.method).toBe('GET');
    request.flush(page);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('جراحی آب مروارید');
  });

  it('deletes through the ServiceAdmin route after confirmation', () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('/ServiceAdmin/Index')).flush(page);
    fixture.detectChanges();

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const host = fixture.nativeElement as HTMLElement;
    const deleteButton = host.querySelector<HTMLButtonElement>('button[aria-label^="حذف خدمت"]');
    expect(deleteButton).toBeTruthy();
    deleteButton!.click();

    const request = httpMock.expectOne((req) => req.url.endsWith('/ServiceAdmin/Delete/7'));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);

    httpMock.expectOne((req) => req.url.endsWith('/ServiceAdmin/Index')).flush(page);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
