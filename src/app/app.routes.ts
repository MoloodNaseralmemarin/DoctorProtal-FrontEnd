import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home-component/home-component";
import { MainLayout } from "./layout/main-layout/main-layout";
import { EyeCareTipDetailComponent } from "./pages/details/eye-care-tip-detail-component/eye-care-tip-detail-component";
import { BlogDetailComponent } from "./pages/details/blog-detail-component/blog-detail-component";
import { authGuard } from "./core/auth-guard";


export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: HomeComponent },

      { path: 'eye-care-tip/:id', component: EyeCareTipDetailComponent },

      { path: 'blog/:id', component: BlogDetailComponent },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-component/login-component').then(m => m.LoginComponent),
  },
  {
    path: 'admin-panel',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout').then(m => m.DashboardLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-panel-component/admin-panel-component').then(m => m.AdminPanelComponent),
      },
      {
        path: 'banner-upload',
        loadComponent: () =>
          import('./pages/admin/admin-banner-upload-component/admin-banner-upload-component').then(m => m.AdminBannerUploadComponent),
      },
      {
        path: 'admin-doctor-profile',
        loadComponent: () =>
          import('./pages/admin/admin-doctor-profile-component/admin-doctor-profile-component').then(m => m.AdminDoctorProfileComponent),
      },
      {
        path: 'admin-eye-careTip',
        loadComponent: () =>
          import('./pages/admin/admin-eye-care-tip-component/admin-eye-care-tip-component').then(m => m.AdminEyeCareTipComponent),
      },
      {
        path: 'admin-blog',
        loadComponent: () =>
          import('./pages/admin/admin-blog-component/admin-blog-component').then(m => m.AdminBlogComponent),
      },
      // Backwards-compatible alias for the old duplicated path.
      {
        path: 'admin-panel',
        redirectTo: '',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'dashboard',
    redirectTo: 'admin-panel',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
