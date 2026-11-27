import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SiteBannerComponent } from '../site-banner/site-banner';
import { ServicesSectionComponent } from '../services/services-section';
import { DoctorProfileComponent } from '../doctor-profile/doctor-profile';
import { EyeCareTipListComponent } from '../eye-care-tip/eye-care-tip-list/eye-care-tip-list';
import { BlogListComponent } from '../blog/blog-list/blog-list';
import { GalleryComponent } from '../gallery/gallery';

/** Composes the single-page public site from its independent sections. */
@Component({
  selector: 'app-home-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteBannerComponent,
    ServicesSectionComponent,
    DoctorProfileComponent,
    EyeCareTipListComponent,
    BlogListComponent,
    GalleryComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {}
