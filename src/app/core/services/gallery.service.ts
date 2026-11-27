import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GalleryImage } from '../models/gallery.model';
import { PagedResult } from '../models/paged-result.model';
import { toPagedResult } from '../http/paged-result';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/gallery`;

  getGallery(pageNumber = 1, pageSize = 6): Observable<PagedResult<GalleryImage>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    return this.http
      .get<GalleryImage[] | Partial<PagedResult<GalleryImage>>>(this.apiUrl, { params })
      .pipe(map((response) => toPagedResult(response, pageNumber, pageSize)));
  }
}
