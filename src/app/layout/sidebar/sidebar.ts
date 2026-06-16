import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems = [
    { path: '/admin-panel/admin-panel', label: 'پیشخوان', icon: 'fas fa-th-large' },
    { path: '/admin-panel/banner-upload', label: 'مدیریت بنرها', icon: 'fas fa-images' },
    { path: '/admin-panel/service', label: 'خدمات مطب', icon: 'fas fa-stethoscope' },
    { path: '/admin-panel/admin-doctor-profile', label: 'پروفایل پزشک', icon: 'fas fa-user-md' },
    { path: '/admin-panel/admin-eye-careTip', label: 'نکات مراقبتی', icon: 'fas fa-eye' },
    { path: '/admin-panel/admin-blog', label: 'وبلاگ', icon: 'fas fa-newspaper' },
  ];

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}