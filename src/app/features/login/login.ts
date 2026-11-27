import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/auth/auth.service';
import { toApiError } from '../../core/http/api-error';

const DEFAULT_REDIRECT = '/admin-panel';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loginForm = this.fb.nonNullable.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly errorMessage = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly currentYear = new Date().getFullYear();

  protected onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting()) {
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    const { userName, password } = this.loginForm.getRawValue();

    this.authService
      .login(userName, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          void this.router.navigateByUrl(this.redirectUrl());
        },
        error: (error: unknown) => {
          const apiError = toApiError(error);
          // 401 here means wrong credentials, not an expired session.
          this.errorMessage.set(
            apiError.status === 401 ? 'نام کاربری یا رمز عبور اشتباه است' : apiError.message,
          );
          this.isSubmitting.set(false);
        },
      });
  }

  /** Only same-app admin URLs are accepted as a post-login destination. */
  private redirectUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    return returnUrl?.startsWith('/admin-panel') ? returnUrl : DEFAULT_REDIRECT;
  }
}
