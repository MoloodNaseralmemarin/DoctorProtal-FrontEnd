import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GalleryImage } from '../../models/gallery.model';
import { PagedResult } from '../../models/paged-result.model';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getGallery(pageNumber: number, pageSize: number): Observable<PagedResult<GalleryImage>> {
    const url = this.apiUrl.endsWith('/') ? `${this.apiUrl}gallery` : `${this.apiUrl}/gallery`;
    return this.http.get<PagedResult<GalleryImage>>(
      `${url}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}