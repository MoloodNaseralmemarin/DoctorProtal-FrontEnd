import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { testProviders } from '../../../testing/test-providers';

describe('Auth', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: testProviders });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    service.logout();
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts to /login and stores the token from the response object', () => {
    let token = '';
    service.login('doctor', 'secret').subscribe((value) => (token = value));

    const request = httpMock.expectOne((req) => req.url.endsWith('/login'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ userName: 'doctor', password: 'secret' });
    request.flush({ token: 'header.payload.signature', role: 'Admin' });

    expect(token).toBe('header.payload.signature');
    expect(service.getToken()).toBe('header.payload.signature');
  });

  it('rejects a response without a token', () => {
    let failed = false;
    service.login('doctor', 'secret').subscribe({ error: () => (failed = true) });

    httpMock
      .expectOne((req) => req.url.endsWith('/login'))
      .flush({ token: '', role: 'Admin' });

    expect(failed).toBe(true);
    expect(service.getToken()).toBeNull();
  });
});
