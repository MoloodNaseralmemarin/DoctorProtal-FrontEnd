import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../auth/auth.service';

/**
 * Normalises session expiry: when the API answers 401 the stored token is
 * useless, so it is dropped and the visitor is sent to the login page with a
 * return URL. A failed login attempt (401 from the auth endpoint) is left to
 * the login form so it can show "wrong credentials" instead of redirecting.
 *
 * The error is always re-thrown; features still render their own messages.
 */
export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      const isLoginRequest = req.url.endsWith('/Auth');

      if (isUnauthorized && !isLoginRequest) {
        authService.logout();

        if (isPlatformBrowser(platformId) && !router.url.startsWith('/login')) {
          void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        }
      }

      return throwError(() => error);
    }),
  );
};
