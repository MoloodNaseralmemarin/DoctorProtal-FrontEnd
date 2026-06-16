import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home-component/home-component";
import { AdminBannerUploadComponent } from "./pages/admin/admin-banner-upload-component/admin-banner-upload-component";
import { AdminDoctorProfileComponent } from "./pages/admin/admin-doctor-profile-component/admin-doctor-profile-component";
import { AdminEyeCareTipComponent } from "./pages/admin/admin-eye-care-tip-component/admin-eye-care-tip-component";
import { LoginComponent } from "./pages/login-component/login-component";
import { AdminBlogComponent } from "./pages/admin/admin-blog-component/admin-blog-component";
import { ServiceListComponent } from "./pages/service-list-component/service-list-component";
import { AdminPanelComponent } from "./pages/admin-panel-component/admin-panel-component";
import { MainLayout } from "./layout/main-layout/main-layout";
import { EyeCareTipDetailComponent } from "./pages/details/eye-care-tip-detail-component/eye-care-tip-detail-component";
import { BlogDetailComponent } from "./pages/details/blog-detail-component/blog-detail-component";
import { authGuard } from "./core/auth-guard";
import { DashboardLayout } from "./layout/dashboard-layout/dashboard-layout";


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
  { path: 'login', component: LoginComponent },
  {
    path: 'admin-panel',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
           {
        path: 'admin-panel',
        component: AdminPanelComponent
      },
      {
        path: 'banner-upload',
        component: AdminBannerUploadComponent
      },
      {
        path: 'admin-doctor-profile',
        component: AdminDoctorProfileComponent
      },
      {
        path: 'admin-eye-careTip',
        component: AdminEyeCareTipComponent
      },
      {
        path: 'admin-blog',
        component: AdminBlogComponent
      },
    ]
  },
  {
    path: 'dashboard',
    redirectTo: 'admin-panel',
    pathMatch: 'full'
  }
];