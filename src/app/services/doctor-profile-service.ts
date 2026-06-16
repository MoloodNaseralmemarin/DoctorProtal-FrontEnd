import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.prod';
import { DoctorProfile } from '../../models/doctor-profile.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorProfileService {
  private readonly doctorProfileUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDoctorProfile(): Observable<DoctorProfile> {
    return this.http.get<DoctorProfile>(`${this.doctorProfileUrl}/DoctorProfile/profile`);
  }

  update(model: DoctorProfile): Observable<void> {
    return this.http.put<void>(`${this.doctorProfileUrl}/DoctorProfile/edit`, model);
  }
}
