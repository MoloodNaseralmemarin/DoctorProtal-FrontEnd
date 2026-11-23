import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ServiceDto, UpdateServiceDto } from '../../models/ServiceDto';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private readonly serviceUrl = `${environment.apiUrl}/Service/Index`;
  constructor(private http: HttpClient) {}

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>(this.serviceUrl).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Service API Error:', error);
    return throwError(() => error);
  }

  getAll(): Observable<UpdateServiceDto[]> {
    return this.http.get<UpdateServiceDto[]>(this.serviceUrl);
  }

  update(service: UpdateServiceDto): Observable<UpdateServiceDto> {
    return this.http.put<UpdateServiceDto>(`${this.serviceUrl}/${service.id}`, service);
  }
}
