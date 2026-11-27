import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { FooterDto } from '../models/footer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/footer`;
  private footer$?: Observable<FooterDto>;

  /**
   * The header and the footer both need this payload; sharing the response
   * keeps them from issuing two identical requests. A failed request is not
   * cached, so the next subscriber retries.
   */
  getFooter(): Observable<FooterDto> {
    this.footer$ ??= this.http
      .get<FooterDto>(this.apiUrl)
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));

    return this.footer$;
  }
}
