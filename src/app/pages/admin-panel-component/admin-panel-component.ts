import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface QuickAction {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-panel-component',
  standalone:true,
  imports:[CommonModule, RouterModule],
  templateUrl: './admin-panel-component.html',
  styleUrl: './admin-panel-component.css',
})
export class AdminPanelComponent {
  readonly quickActions: QuickAction[] = [
    { path: '/admin-panel/admin-blog', label: 'ارسال بلاگ جدید', icon: 'fas fa-newspaper' },
    { path: '/admin-panel/admin-eye-careTip', label: 'افزودن نکته مراقبتی', icon: 'fas fa-eye' },
    { path: '/admin-panel/banner-upload', label: 'تغییر بنر سایت', icon: 'fas fa-images' },
    { path: '/admin-panel/admin-doctor-profile', label: 'ویرایش پروفایل پزشک', icon: 'fas fa-user-md' },
  ];
}
