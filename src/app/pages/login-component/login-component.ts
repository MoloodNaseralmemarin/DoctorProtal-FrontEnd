import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage = '';

    const { userName, password } = this.loginForm.value;

    this.authService.login(userName, password).subscribe({
      next: (token: string) => {
        this.authService.setToken(token);
        this.router.navigate(['/admin-panel']);
      },
      error: (err) => {
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
