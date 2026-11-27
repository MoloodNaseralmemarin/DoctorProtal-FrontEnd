import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ServiceDto } from '../models/service.model';

/** Read/write access to the clinic services shown on the public home page. */
@Injectable({
  providedIn: 'root',
})
export class ServiceCatalogService {
  private readonly http = inject(HttpClient);
  private readonly serviceUrl = `${environment.apiUrl}/Service/Index`;
  private readonly updateUrl = `${environment.apiUrl}/admin/ServiceAdmin/update`;

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.serviceUrl);
  }

  /**
   * The backend has no per-item route: the whole list is replaced in one PUT
   * with an array of `{ id, title, description }`.
   */
  updateServices(services: readonly ServiceDto[]): Observable<void> {
    return this.http.put<void>(this.updateUrl, services);
  }
}
