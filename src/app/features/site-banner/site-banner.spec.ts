import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteBannerComponent } from './site-banner';
import { testProviders } from '../../../testing/test-providers';

describe('SiteBannerComponent', () => {
  let component: SiteBannerComponent;
  let fixture: ComponentFixture<SiteBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteBannerComponent],
      providers: testProviders,
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
