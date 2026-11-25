import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Headercomponent } from './headercomponent';
import { testProviders } from '../../../testing/test-providers';

describe('Headercomponent', () => {
  let component: Headercomponent;
  let fixture: ComponentFixture<Headercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Headercomponent],
      providers: testProviders,
    })
    .compileComponents();

    fixture = TestBed.createComponent(Headercomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
