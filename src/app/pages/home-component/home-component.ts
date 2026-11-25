import { Component } from '@angular/core';
import { SiteBannerComponent } from '../site-banner-component/site-banner-component';
import { ServiceListComponent } from '../service-list-component/service-list-component';
import { DoctorProfileComponent } from '../doctor-profile-component/doctor-profile-component';
import { EyeCareTipComponent } from '../eye-care-tip-component/eye-care-tip-component';
import { BlogComponent } from '../blog-component/blog-component';
import { GalleryComponent } from "../gallery-component/gallery-component";

@Component({
  selector: 'app-home-component',
  imports: [
    SiteBannerComponent,
    ServiceListComponent,
    DoctorProfileComponent,
    EyeCareTipComponent,
    BlogComponent,
    GalleryComponent
],
  standalone: true,
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent {}
