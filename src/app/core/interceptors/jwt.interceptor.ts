import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Attaches the bearer token to requests aimed at our own API. Requests to
 * third-party hosts (or the login endpoint itself) never carry the token, so
 * it cannot leak to an external service.
 */
export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isLoginRequest = req.url.endsWith('/Auth');

  if (!isApiRequest || isLoginRequest) {
    return next(req);
  }

  const token = inject(AuthService).getToken();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
