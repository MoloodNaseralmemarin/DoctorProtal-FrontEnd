import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteBannerDto } from '../models/site-banner.model';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  /**
   * The public banner DTO exposes only `imageUrl`, so the record id cannot be
   * read back from the API. The backend stores a single banner; its id is
   * assumed to be 1 until an admin read endpoint is available.
   */
  private static readonly DEFAULT_BANNER_ID = 1;

  private readonly http = inject(HttpClient);

  private readonly siteBannerUrl = `${environment.apiUrl}/SiteBanner/site-banner`;
  private readonly uploadUrl = `${environment.apiUrl}/SiteBannerAdmin/banner-upload`;

  getBanner(): Observable<SiteBannerDto> {
    return this.http.get<SiteBannerDto>(this.siteBannerUrl);
  }

  /** `PUT /api/SiteBannerAdmin/banner-upload` (multipart: Id + Image). */
  updateBanner(file: File, id: number = BannerService.DEFAULT_BANNER_ID): Observable<void> {
    const formData = new FormData();

    formData.append('Id', String(id));
    formData.append('Image', file, file.name);

    return this.http.put<void>(this.uploadUrl, formData);
  }
}
