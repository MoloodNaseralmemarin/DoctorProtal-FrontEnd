import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { HeaderComponent } from './header';
import { testProviders } from '../../../testing/test-providers';
import { FooterDto } from '../../core/models/footer.model';

const MOBILE_LABEL = '0912 123 4567';
const MOBILE_DIAL = '09121234567';

const payload: FooterDto = {
  address: {
    title: 'نشانی مطب',
    lines: ['خیابان ولیعصر'],
    phone: { landline: '02188776655', mobile: MOBILE_LABEL },
  },
  services: [],
  social: [{ icon: 'instagram', link: 'https://instagram.com/example' }],
  copyright: 'کلیه حقوق محفوظ است',
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: testProviders,
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne((request) => request.url.endsWith('/footer')).flush(payload);
    expect(component).toBeTruthy();
  });

  it('renders only the single phone number from the footer payload', () => {
    fixture.detectChanges();
    httpMock.expectOne((request) => request.url.endsWith('/footer')).flush(payload);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const telLinks = Array.from(host.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'));

    expect(telLinks.length).toBeGreaterThan(0);
    expect(new Set(telLinks.map((link) => link.getAttribute('href')))).toEqual(
      new Set([`tel:${MOBILE_DIAL}`]),
    );
    expect(host.textContent).toContain(MOBILE_LABEL);

    // No number may survive from the removed hardcoded constants.
    expect(host.textContent).not.toContain('081-32532356');
    expect(host.textContent).not.toContain('0918 305 0600');
  });

  it('hides the phone when the footer API fails instead of showing a static number', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((request) => request.url.endsWith('/footer'))
      .flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('a[href^="tel:"]').length).toBe(0);
  });
});
