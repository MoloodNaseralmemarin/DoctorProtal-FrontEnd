import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DoctorProfile } from '../models/doctor-profile.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorProfileService {
  private readonly http = inject(HttpClient);
  private readonly profileUrl = `${environment.apiUrl}/DoctorProfile`;
  private readonly adminProfileUrl = `${environment.apiUrl}/admin/DoctorProfileAdmin`;

  getDoctorProfile(): Observable<DoctorProfile> {
    return this.http.get<DoctorProfile>(`${this.profileUrl}/profile`);
  }

  /** Writes go through the admin controller, not the public one. */
  update(model: DoctorProfile): Observable<void> {
    return this.http.put<void>(`${this.adminProfileUrl}/edit`, model);
  }
}
