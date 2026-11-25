import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEyeCareTipComponent } from './admin-eye-care-tip-component';
import { testProviders } from '../../../../testing/test-providers';

describe('AdminEyeCareTipComponent', () => {
  let component: AdminEyeCareTipComponent;
  let fixture: ComponentFixture<AdminEyeCareTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEyeCareTipComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEyeCareTipComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
