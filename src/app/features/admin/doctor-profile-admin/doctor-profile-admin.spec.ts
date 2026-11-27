import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoctorProfileComponent } from './doctor-profile-admin';
import { testProviders } from '../../../../testing/test-providers';

describe('AdminDoctorProfileComponent', () => {
  let component: AdminDoctorProfileComponent;
  let fixture: ComponentFixture<AdminDoctorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDoctorProfileComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoctorProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
