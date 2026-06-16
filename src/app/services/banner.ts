import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Observable,
  throwError,
  catchError,
} from 'rxjs';

import { environment } from '../../environments/environment.prod';
import { SiteBannerDto } from '../../models/siteBannerDto.model';



@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  private readonly siteBannerUrl =
    `${this.apiUrl}/SiteBanner/site-banner`;

  private readonly uploadUrl =
    `${this.apiUrl}/admin/SiteBannerAdmin/banner-upload`;

    
  getBanner(): Observable<SiteBannerDto> {
    return this.http
      .get<SiteBannerDto>(this.siteBannerUrl)
      .pipe(catchError(this.handleError));
  }

  updateBanner(
    file: File,
    caption: string
  ): Observable<void> {
    const formData = new FormData();

    formData.append('image', file);
    formData.append('caption', caption);

    return this.http
      .put<void>(this.uploadUrl, formData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('[BannerService]', error);

    return throwError(() => ({
      status: error.status,
      message:
        error.error?.message ??
        error.message ??
        'خطا در ارتباط با سرور',
    }));
  }
}