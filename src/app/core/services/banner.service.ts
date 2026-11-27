import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteBannerDto } from '../models/site-banner.model';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private readonly http = inject(HttpClient);

  private readonly siteBannerUrl = `${environment.apiUrl}/SiteBanner/site-banner`;
  private readonly uploadUrl = `${environment.apiUrl}/admin/SiteBannerAdmin/banner-upload`;

  getBanner(): Observable<SiteBannerDto> {
    return this.http.get<SiteBannerDto>(this.siteBannerUrl);
  }

  updateBanner(file: File, caption: string): Observable<void> {
    const formData = new FormData();

    formData.append('image', file);
    formData.append('caption', caption);

    return this.http.put<void>(this.uploadUrl, formData);
  }
}
