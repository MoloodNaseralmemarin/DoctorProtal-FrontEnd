import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Blog } from '../models/blog.model';
import { PagedResult } from '../models/paged-result.model';
import { toPagedResult } from '../http/paged-result';

/**
 * Blog access is split by audience: the public site reads `/api/Blog`, while
 * the admin panel reads `/api/admin/BlogAdmin`. Both return a paged envelope.
 */
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly publicUrl = `${environment.apiUrl}/Blog`;
  private readonly adminUrl = `${environment.apiUrl}/admin/BlogAdmin`;

  /** Public list of published articles. The API defaults to a page size of 3. */
  getPublicAll(pageNumber = 1, pageSize = 3): Observable<PagedResult<Blog>> {
    return this.getPaged(this.publicUrl, pageNumber, pageSize);
  }

  getPublicById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.publicUrl}/${id}`);
  }

  /** Admin list, including drafts; requires the bearer token. */
  getAdminAll(pageNumber = 1, pageSize = 10): Observable<PagedResult<Blog>> {
    return this.getPaged(this.adminUrl, pageNumber, pageSize);
  }

  getAdminById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.adminUrl}/${id}`);
  }

  /** Active articles as a plain array (no paging on this endpoint). */
  getActive(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.adminUrl}/active`);
  }

  create(model: Partial<Blog>): Observable<unknown> {
    return this.http.post(`${this.adminUrl}/Create`, model);
  }

  /**
   * The backend keeps no update route for articles (the deployed API answers
   * 405), so this fails locally with a clear message instead of a broken call.
   */
  update(_id: number, _model: Partial<Blog>): Observable<never> {
    return throwError(() => new Error('ویرایش مقاله در سرویس فعلی پشتیبانی نمی‌شود'));
  }

  /** No delete route exists either; see {@link update}. */
  delete(_id: number): Observable<never> {
    return throwError(() => new Error('حذف مقاله در سرویس فعلی پشتیبانی نمی‌شود'));
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
