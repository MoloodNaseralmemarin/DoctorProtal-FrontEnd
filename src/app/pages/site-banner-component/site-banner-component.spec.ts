import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteBannerComponent } from './site-banner-component';

describe('SiteBannerComponent', () => {
  let component: SiteBannerComponent;
  let fixture: ComponentFixture<SiteBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
