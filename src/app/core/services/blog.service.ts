import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Blog } from '../models/blog.model';
import { PagedResult } from '../models/paged-result.model';
import { toPagedResult } from '../http/paged-result';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/BlogAdmin`;

  /**
   * Paged list with an optional title filter. The API answers with either a
   * paged envelope or a plain array, so the response is normalised here and
   * every caller receives a `PagedResult`.
   */
  getAll(pageNumber = 1, pageSize = 10, title?: string): Observable<PagedResult<Blog>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    const search = title?.trim();

    if (search) {
      params = params.set('title', search);
    }

    return this.http
      .get<Blog[] | Partial<PagedResult<Blog>>>(`${this.baseUrl}/Index`, { params })
      .pipe(map((response) => toPagedResult(response, pageNumber, pageSize)));
  }

  getById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.baseUrl}/Edit/${id}`);
  }

  create(model: Partial<Blog>): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/Create`, model);
  }

  update(id: number, model: Partial<Blog>): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/Edit/${id}`, model);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Delete/${id}`);
  }
}
