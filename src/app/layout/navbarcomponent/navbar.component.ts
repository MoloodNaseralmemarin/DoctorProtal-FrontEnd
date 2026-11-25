import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-navbarComponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  fullName: string = 'کاربر';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (isPlatformBrowser(this.platformId)) {
      try {
        // اگر بعداً اسم کاربر رو ذخیره کردی
        const name = localStorage.getItem('fullName');
        if (name) {
          this.fullName = name;
        }
      } catch {
        // Storage can be unavailable in restricted browser contexts.
      }
    }
  }

  logout(): void {
    this.authService.logout();
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem('fullName');
      } catch {
        // Storage can be unavailable in restricted browser contexts.
      }
    }
    this.router.navigate(['/login']);
  }
}
