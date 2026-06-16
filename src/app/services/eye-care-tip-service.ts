import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EyeCareTip } from '../../models/eye-care-tip.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { PagedResult } from '../../models/paged-result.model';

@Injectable({
  providedIn: 'root',
})
export class EyeCareTipService {

private apiUrl = `${environment.apiUrl}/EyeCareTips`;



  constructor(private http: HttpClient) {}

getAll(pageNumber: number = 1, pageSize: number = 3) {
  return this.http.get<any>(
    `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
}

  
  getById(id: number): Observable<EyeCareTip> {
    return this.http.get<EyeCareTip>(`${this.apiUrl}/${id}`);
  }

  create(model: Partial<EyeCareTip>): Observable<any> {
    return this.http.post(this.apiUrl, model);
  }

  update(id: number, model: Partial<EyeCareTip>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, model);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}