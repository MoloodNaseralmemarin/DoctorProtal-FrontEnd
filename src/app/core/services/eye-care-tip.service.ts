import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EyeCareTip } from '../models/eye-care-tip.model';
import { PagedResult } from '../models/paged-result.model';
import { toPagedResult } from '../http/paged-result';

@Injectable({
  providedIn: 'root',
})
export class EyeCareTipService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/EyeCareTips`;

  getAll(pageNumber = 1, pageSize = 3): Observable<PagedResult<EyeCareTip>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    return this.http
      .get<EyeCareTip[] | Partial<PagedResult<EyeCareTip>>>(this.apiUrl, { params })
      .pipe(map((response) => toPagedResult(response, pageNumber, pageSize)));
  }

  getById(id: number): Observable<EyeCareTip> {
    return this.http.get<EyeCareTip>(`${this.apiUrl}/${id}`);
  }

  create(model: Partial<EyeCareTip>): Observable<unknown> {
    return this.http.post(this.apiUrl, model);
  }

  update(id: number, model: Partial<EyeCareTip>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, model);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
