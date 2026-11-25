import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<string> {
    // PascalCase is required by the ASP.NET Core DTO.
    return this.http
      .post(`${this.apiUrl}`, { UserName: userName, Password: password }, { responseType: 'text' })
      .pipe(map((response) => this.normalizeToken(response)));
  }

  /**
   * ASP.NET Core serialises a plain string result as a JSON string
   * (`"eyJ..."`), so the surrounding quotes must be removed before the value
   * can be sent as a bearer token. Raw text tokens are returned unchanged.
   */
  private normalizeToken(response: string): string {
    const value = (response ?? '').trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        return (JSON.parse(value) as string).trim();
      } catch {
        return value.replace(/^"|"$/g, '').trim();
      }
    }

    return value;
  }

  getToken(): string | null {
    return this.storage?.getItem(this.tokenKey) ?? null;
  }

  setToken(token: string): void {
    this.storage?.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage?.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * `localStorage` is not available during server rendering and can throw in
   * restricted browser contexts, so every access goes through this guard.
   */
  private get storage(): Storage | null {
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch {
      return null;
    }
  }
}
