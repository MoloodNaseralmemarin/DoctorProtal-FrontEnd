import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { FooterComponent } from './footer';
import { testProviders } from '../../../testing/test-providers';
import { FooterDto } from '../../core/models/footer.model';

/**
 * Regression guard: the footer used to be wrapped in `*ngIf="footer"`, so a
 * failed /api/footer request removed the whole <footer> from the page. These
 * tests pin both outcomes: full content when the API answers, and a still
 * visible footer with the fallback copyright when it does not.
 */
const payload: FooterDto = {
  address: {
    title: 'نشانی مطب',
    lines: ['خیابان ولیعصر', 'پلاک ۱۲'],
    phone: { landline: '02188776655', mobile: '09121234567' },
  },
  services: ['معاینه و تشخیص بیماری‌های چشمی', 'جراحی قرنیه'],
  social: [{ icon: 'instagram', link: 'https://instagram.com/example' }],
  copyright: 'کلیه حقوق برای کلینیک دکتر حق‌پرست محفوظ است',
};

const FALLBACK_COPYRIGHT = 'کلیه حقوق این وب‌سایت محفوظ است.';

describe('FooterComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: testProviders,
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function create(): ComponentFixture<FooterComponent> {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    return fixture;
  }

  function footerElement(fixture: ComponentFixture<FooterComponent>): HTMLElement {
    const footer = fixture.nativeElement.querySelector('footer#footer');
    expect(footer).toBeTruthy();
    return footer as HTMLElement;
  }

  it('should create', () => {
    const fixture = create();
    expect(fixture.componentInstance).toBeTruthy();
    httpMock.expectOne((request) => request.url.endsWith('/footer')).flush(payload);
  });

  it('renders services, address, the single API phone and copyright', () => {
    const fixture = create();

    httpMock.expectOne((request) => request.url.endsWith('/footer')).flush(payload);
    fixture.detectChanges();

    const footer = footerElement(fixture);
    const text = footer.textContent ?? '';

    expect(footer.querySelectorAll('li').length).toBe(payload.services.length);
    for (const service of payload.services) {
      expect(text).toContain(service);
    }

    expect(text).toContain(payload.address.title);
    expect(text).toContain(payload.address.lines[0]);
    expect(text).toContain(payload.address.phone.mobile);
    expect(text).not.toContain(payload.address.phone.landline);

    const telLinks = Array.from(footer.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'));
    expect(telLinks.length).toBe(1);
    expect(telLinks[0].getAttribute('href')).toBe(`tel:${payload.address.phone.mobile}`);
    expect(footer.querySelector('a[href="https://instagram.com/example"]')).toBeTruthy();

    expect(text).toContain(payload.copyright);
    expect(text).not.toContain(FALLBACK_COPYRIGHT);
  });

  it('falls back to the landline only when the payload has no mobile number', () => {
    const fixture = create();

    httpMock.expectOne((request) => request.url.endsWith('/footer')).flush({
      ...payload,
      address: { ...payload.address, phone: { landline: '02188776655', mobile: '' } },
    });
    fixture.detectChanges();

    const text = footerElement(fixture).textContent ?? '';
    expect(text).toContain('02188776655');
  });

  it('still renders the footer with the fallback copyright when the API fails', () => {
    const fixture = create();

    httpMock
      .expectOne((request) => request.url.endsWith('/footer'))
      .flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const footer = footerElement(fixture);
    const text = footer.textContent ?? '';

    expect(text).toContain('دکتر رکسانا حق پرست');
    expect(text).toContain(FALLBACK_COPYRIGHT);
    expect(footer.querySelector('#footer-services-title')).toBeNull();
    expect(footer.querySelector('a[href^="tel:"]')).toBeNull();
  });
});
