import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBannerUploadComponent } from './admin-banner-upload-component';

describe('AdminBannerUploadComponent', () => {
  let component: AdminBannerUploadComponent;
  let fixture: ComponentFixture<AdminBannerUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBannerUploadComponent]
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
