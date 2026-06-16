import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`; // آدرس API از محیط
  private tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  login(UserName: string, Password: string): Observable<any> {
    // استفاده از PascalCase برای هماهنگی با DTO های دات‌نت
    return this.http.post(this.apiUrl, { UserName, Password }, { responseType: 'text' });
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
