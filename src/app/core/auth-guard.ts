import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
