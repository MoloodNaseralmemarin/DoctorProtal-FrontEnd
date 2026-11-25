import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceListComponent } from './service-list-component';
import { testProviders } from '../../../testing/test-providers';


describe('ServiceComponent', () => {
  let component: ServiceListComponent;
  let fixture: ComponentFixture<ServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceListComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
