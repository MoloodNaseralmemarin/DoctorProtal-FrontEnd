import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBlogComponent } from './blog-admin';
import { testProviders } from '../../../../testing/test-providers';

describe('AdminBlogComponent', () => {
  let component: AdminBlogComponent;
  let fixture: ComponentFixture<AdminBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBlogComponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBlogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
