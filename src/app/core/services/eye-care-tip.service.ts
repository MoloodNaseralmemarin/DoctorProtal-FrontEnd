import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EyeCareTip } from '../models/eye-care-tip.model';
import { PagedResult } from '../models/paged-result.model';
import { toPagedResult } from '../http/paged-result';

/**
 * The public site reads `/api/EyeCareTips`; CRUD lives under the separate
 * `/api/EyeCareTipAdmin` controller. Its route is `api/[controller]`, so the
 * segment is `EyeCareTipAdmin` — neither `/admin/` nor `EyeCareTipsAdmin`
 * matches and both fall through to the SPA's `index.html`.
 */
@Injectable({
  providedIn: 'root',
})
export class EyeCareTipService {
  private readonly http = inject(HttpClient);
  private readonly publicUrl = `${environment.apiUrl}/EyeCareTips`;
  private readonly adminUrl = `${environment.apiUrl}/EyeCareTipAdmin`;

  /** Public paged list; the API defaults to a page size of 3. */
  getPublicAll(pageNumber = 1, pageSize = 3): Observable<PagedResult<EyeCareTip>> {
    return this.getPaged(this.publicUrl, pageNumber, pageSize);
  }

  getPublicById(id: number): Observable<EyeCareTip> {
    return this.http.get<EyeCareTip>(`${this.publicUrl}/${id}`);
  }

  /** Admin paged list, including inactive tips. */
  getAdminAll(pageNumber = 1, pageSize = 3): Observable<PagedResult<EyeCareTip>> {
    return this.getPaged(this.adminUrl, pageNumber, pageSize);
  }

  getAdminById(id: number): Observable<EyeCareTip> {
    return this.http.get<EyeCareTip>(`${this.adminUrl}/${id}`);
  }

  create(model: Partial<EyeCareTip>): Observable<unknown> {
    return this.http.post(this.adminUrl, this.toPayload(model));
  }

  update(id: number, model: Partial<EyeCareTip>): Observable<void> {
    return this.http.put<void>(`${this.adminUrl}/${id}`, this.toPayload(model));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  /** Only the writable fields are sent; ids and audit dates are server-owned. */
  private toPayload(model: Partial<EyeCareTip>): Partial<EyeCareTip> {
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
  ): Observable<PagedResult<EyeCareTip>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    return this.http
      .get<EyeCareTip[] | Partial<PagedResult<EyeCareTip>>>(url, { params })
      .pipe(map((response) => toPagedResult(response, pageNumber, pageSize)));
  }
}
