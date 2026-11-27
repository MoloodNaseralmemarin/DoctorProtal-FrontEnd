import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Shape documented by `POST /api/Auth` in Swagger. */
interface LoginRequest {
  userName: string;
  password: string;
}

interface JwtPayload {
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly loginUrl = `${environment.apiUrl}/Auth`;
  private readonly tokenKey = 'token';

  login(userName: string, password: string): Observable<string> {
    const body: LoginRequest = { userName, password };

    return this.http
      .post(this.loginUrl, body, { responseType: 'text' })
      .pipe(
        map((response) => this.normalizeToken(response)),
        tap((token) => this.setToken(token)),
      );
  }

  getToken(): string | null {
    return this.storage?.getItem(this.tokenKey) ?? null;
  }

  setToken(token: string): void {
    this.storage?.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage?.removeItem(this.tokenKey);
    // Left behind by an earlier version of the navbar component.
    this.storage?.removeItem('fullName');
  }

  /**
   * A token that is present but past its `exp` claim is treated as logged out,
   * so an expired session cannot open the admin panel and then fail every
   * request with 401.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const expiresAt = this.readExpiry(token);

    if (expiresAt !== null && expiresAt <= Date.now()) {
      this.logout();
      return false;
    }

    return true;
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

  /** Reads `exp` from the JWT payload without pulling in a decoder library. */
  private readExpiry(token: string): number | null {
    const payload = token.split('.')[1];

    if (!payload || typeof atob === 'undefined') {
      return null;
    }

    try {
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const decoded = JSON.parse(atob(padded)) as JwtPayload;

      return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
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
