import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FooterDto } from '../../models/footer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

private readonly apiUrl = `${environment.apiUrl}/footer`;
constructor(private http: HttpClient) {}

  getFooter(): Observable<FooterDto> {
    return this.http.get<FooterDto>(this.apiUrl);
  }
}
