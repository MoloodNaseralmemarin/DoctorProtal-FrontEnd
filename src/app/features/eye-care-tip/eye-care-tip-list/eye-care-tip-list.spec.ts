import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeCareTipListComponent } from './eye-care-tip-list';
import { testProviders } from '../../../../testing/test-providers';

describe('EyeCareTipListComponent', () => {
  let component: EyeCareTipListComponent;
  let fixture: ComponentFixture<EyeCareTipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeCareTipListComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeCareTipListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
