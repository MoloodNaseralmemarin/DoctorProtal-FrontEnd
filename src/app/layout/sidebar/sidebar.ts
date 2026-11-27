import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/auth/auth.service';

interface SidebarLink {
  path: string;
  label: string;
  icon: string;
}

/** Admin navigation; acts as a drawer below the `lg` breakpoint. */
@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Controls the drawer state below the `lg` breakpoint. */
  readonly open = input(false);
  readonly closed = output<void>();

  protected readonly menuItems: readonly SidebarLink[] = [
    { path: '/admin-panel', label: 'پیشخوان', icon: 'fas fa-th-large' },
    { path: '/admin-panel/banner', label: 'مدیریت بنرها', icon: 'fas fa-images' },
    { path: '/admin-panel/doctor-profile', label: 'پروفایل پزشک', icon: 'fas fa-user-md' },
    { path: '/admin-panel/eye-care-tips', label: 'نکات مراقبتی', icon: 'fas fa-eye' },
    { path: '/admin-panel/blog', label: 'وبلاگ', icon: 'fas fa-newspaper' },
  ];

  protected onLogout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
