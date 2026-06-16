import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-logincomponent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { userName, password } = this.loginForm.value;

    this.authService.login(userName, password).subscribe({
      next: (res: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res);
          console.log('Login successful, token saved.');
        }

        this.router.navigate(['/admin-panel']);
      },
      error: (err) => {
        console.error('Login error details:', err);
        if (err.status === 0) {
          this.errorMessage = 'خطا در برقراری ارتباط با سرور';
        } else if (err.status === 401) {
          this.errorMessage = 'نام کاربری یا رمز عبور اشتباه است (۴۰۱)';
        } else {
          this.errorMessage = `خطای سرور: ${err.status}`;
        }
      }
    });
  }
}