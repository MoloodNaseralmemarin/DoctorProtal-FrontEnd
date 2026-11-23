import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeCareTipComponent } from './eye-care-tip-component';
import { testProviders } from '../../../testing/test-providers';

describe('EyeCareTipComponent', () => {
  let component: EyeCareTipComponent;
  let fixture: ComponentFixture<EyeCareTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeCareTipComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeCareTipComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
