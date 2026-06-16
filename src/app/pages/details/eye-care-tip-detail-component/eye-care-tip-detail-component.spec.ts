import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeCareTipDetailComponent } from './eye-care-tip-detail-component';

describe('EyeCareTipDetailComponent', () => {
  let component: EyeCareTipDetailComponent;
  let fixture: ComponentFixture<EyeCareTipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeCareTipDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeCareTipDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
