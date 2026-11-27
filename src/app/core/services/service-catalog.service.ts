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

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.serviceUrl);
  }

  update(service: ServiceDto): Observable<ServiceDto> {
    return this.http.put<ServiceDto>(`${this.serviceUrl}/${service.id}`, service);
  }
}
