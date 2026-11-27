import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Protects the admin area. Returning a `UrlTree` (instead of navigating by
 * side effect) lets the router cancel the navigation cleanly and keeps the
 * attempted URL so the login page can send the visitor back afterwards.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
