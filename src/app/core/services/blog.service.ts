import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Blog } from '../models/blog.model';
import { PagedResult } from '../models/paged-result.model';
import { toPagedResult } from '../http/paged-result';

/**
 * Blog access is split by audience: the public site reads `/api/Blog`, while
 * the admin panel reads `/api/BlogAdmin`. Both return a paged envelope.
 *
 * The admin controller lives directly under `api/` (its `[Route]` attribute is
 * `api/[controller]`), so a `/admin/` prefix produces the SPA's index.html
 * with HTTP 200 and Angular reports a JSON parsing error.
 */
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly publicUrl = `${environment.apiUrl}/Blog`;
  private readonly adminUrl = `${environment.apiUrl}/BlogAdmin`;

  /** Public list of published articles. The API defaults to a page size of 3. */
  getPublicAll(pageNumber = 1, pageSize = 3): Observable<PagedResult<Blog>> {
    return this.getPaged(this.publicUrl, pageNumber, pageSize);
  }

  getPublicById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.publicUrl}/${id}`);
  }

  /** Admin list, including drafts; requires the bearer token. */
  getAdminAll(pageNumber = 1, pageSize = 10): Observable<PagedResult<Blog>> {
    return this.getPaged(`${this.adminUrl}/Index`, pageNumber, pageSize);
  }

  /** Full record, including `bodyText`; the list endpoint omits it. */
  getAdminById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.adminUrl}/${id}`);
  }

  create(model: Partial<Blog>): Observable<Blog> {
    return this.http.post<Blog>(`${this.adminUrl}/Create`, this.toPayload(model));
  }

  update(id: number, model: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${this.adminUrl}/Update/${id}`, this.toPayload(model));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/Delete/${id}`);
  }

  /** Only the writable fields are sent; ids and audit dates are server-owned. */
  private toPayload(model: Partial<Blog>): Partial<Blog> {
    return {
      title: model.title?.trim() ?? '',
      description: model.description?.trim() ?? '',
      bodyText: model.bodyText ?? '',
      isActive: model.isActive ?? true,
    };
  }

  private getPaged(
    url: string,
    pageNumber: number,
    pageSize: number,
  ): Observable<PagedResult<Blog>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    return this.http
      .get<Blog[] | Partial<PagedResult<Blog>>>(url, { params })
      .pipe(map((response) => toPagedResult(response, pageNumber, pageSize)));
  }
}
