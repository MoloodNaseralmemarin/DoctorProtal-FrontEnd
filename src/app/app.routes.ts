import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

/**
 * Every route below the layouts is lazy loaded, so the public page does not
 * download the admin screens and vice versa. Each route carries a title that
 * the document title strategy applies on navigation.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        title: 'دکتر رکسانا حق پرست | جراح چشم و فوق تخصص شبکیه',
        loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'eye-care-tip/:id',
        title: 'نکات مراقبت از چشم',
        loadComponent: () =>
          import('./features/eye-care-tip/eye-care-tip-detail/eye-care-tip-detail').then(
            (m) => m.EyeCareTipDetailComponent,
          ),
      },
      {
        path: 'blog/:id',
        title: 'مقالات چشم‌پزشکی',
        loadComponent: () =>
          import('./features/blog/blog-detail/blog-detail').then((m) => m.BlogDetailComponent),
      },
    ],
  },
  {
    path: 'login',
    title: 'ورود به پنل مدیریت',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'admin-panel',
    title: 'پیشخوان مدیریت',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout').then((m) => m.DashboardLayout),
    children: [
      {
        path: '',
        title: 'پیشخوان مدیریت',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'blog',
        title: 'مدیریت وبلاگ',
        loadComponent: () =>
          import('./features/admin/blog-admin/blog-admin').then((m) => m.AdminBlogComponent),
      },
      {
        path: 'banner',
        title: 'مدیریت بنر',
        loadComponent: () =>
          import('./features/admin/banner-upload/banner-upload').then(
            (m) => m.AdminBannerUploadComponent,
          ),
      },
      {
        path: 'eye-care-tips',
        title: 'نکات مراقبت از چشم',
        loadComponent: () =>
          import('./features/admin/eye-care-tip-admin/eye-care-tip-admin').then(
            (m) => m.AdminEyeCareTipComponent,
          ),
      },
      {
        path: 'doctor-profile',
        title: 'پروفایل پزشک',
        loadComponent: () =>
          import('./features/admin/doctor-profile-admin/doctor-profile-admin').then(
            (m) => m.AdminDoctorProfileComponent,
          ),
      },
      // Legacy paths kept so existing bookmarks and links keep working.
      { path: 'admin-blog', redirectTo: 'blog', pathMatch: 'full' },
      { path: 'banner-upload', redirectTo: 'banner', pathMatch: 'full' },
      { path: 'admin-eye-careTip', redirectTo: 'eye-care-tips', pathMatch: 'full' },
      { path: 'admin-doctor-profile', redirectTo: 'doctor-profile', pathMatch: 'full' },
      { path: 'admin-panel', redirectTo: '', pathMatch: 'full' },
    ],
  },
  { path: 'dashboard', redirectTo: 'admin-panel', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
