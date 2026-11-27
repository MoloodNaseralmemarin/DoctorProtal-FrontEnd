import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/paged-result.model';
import { ServiceDto } from '../models/service.model';
import { toPagedResult } from '../http/paged-result';

/**
 * Read/write access to the clinic services shown on the public home page.
 *
 * Public reads use `/api/Service/Index`; writes use the `ServiceAdmin`
 * controller, which is mounted at `api/ServiceAdmin` (not `/admin/...`).
 */
@Injectable({
  providedIn: 'root',
})
export class ServiceCatalogService {
  private readonly http = inject(HttpClient);
  private readonly serviceUrl = `${environment.apiUrl}/Service/Index`;
  private readonly adminUrl = `${environment.apiUrl}/ServiceAdmin`;

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.serviceUrl);
  }

  /** Admin list, including inactive services. */
  getAdminAll(pageNumber = 1, pageSize = 100): Observable<PagedResult<ServiceDto>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    return this.http
      .get<ServiceDto[] | Partial<PagedResult<ServiceDto>>>(`${this.adminUrl}/Index`, { params })
      .pipe(map((response) => toPagedResult(response, pageNumber, pageSize)));
  }

  create(model: Partial<ServiceDto>): Observable<ServiceDto> {
    return this.http.post<ServiceDto>(`${this.adminUrl}/Create`, this.toPayload(model));
  }

  update(id: number, model: Partial<ServiceDto>): Observable<ServiceDto> {
    return this.http.put<ServiceDto>(`${this.adminUrl}/Update/${id}`, this.toPayload(model));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/Delete/${id}`);
  }

  private toPayload(model: Partial<ServiceDto>): Partial<ServiceDto> {
    return {
      title: model.title?.trim() ?? '',
      description: model.description ?? '',
      isActive: model.isActive ?? true,
    };
  }
}
