import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface QuickAction {
  path: string;
  label: string;
  icon: string;
}

/** Landing screen of the admin area: shortcuts to every editable section. */
@Component({
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AdminDashboardComponent {
  protected readonly quickActions: readonly QuickAction[] = [
    { path: '/admin-panel/blog', label: 'ارسال بلاگ جدید', icon: 'fas fa-newspaper' },
    { path: '/admin-panel/eye-care-tips', label: 'افزودن نکته مراقبتی', icon: 'fas fa-eye' },
    { path: '/admin-panel/banner', label: 'تغییر بنر سایت', icon: 'fas fa-images' },
    { path: '/admin-panel/doctor-profile', label: 'ویرایش پروفایل پزشک', icon: 'fas fa-user-md' },
  ];
}
