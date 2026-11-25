import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { FooterDto } from '../../models/footer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

private readonly apiUrl = `${environment.apiUrl}/footer`;
private footer$?: Observable<FooterDto>;

constructor(private http: HttpClient) {}

  /**
   * The header and the footer both need this payload; sharing the response
   * keeps them from issuing two identical requests.
   */
  getFooter(): Observable<FooterDto> {
    this.footer$ ??= this.http.get<FooterDto>(this.apiUrl).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError((error) => {
        // Do not cache a failed response, so the next subscriber retries.
        this.footer$ = undefined;
        return throwError(() => error);
      }),
    );

    return this.footer$;
  }
}
