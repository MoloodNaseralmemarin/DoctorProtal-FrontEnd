import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBannerUploadComponent } from './banner-upload';
import { testProviders } from '../../../../testing/test-providers';

describe('AdminBannerUploadComponent', () => {
  let component: AdminBannerUploadComponent;
  let fixture: ComponentFixture<AdminBannerUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBannerUploadComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBannerUploadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
