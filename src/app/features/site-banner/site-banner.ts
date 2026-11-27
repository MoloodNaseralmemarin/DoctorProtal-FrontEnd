import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BannerService } from '../../core/services/banner.service';
import { environment } from '../../../environments/environment';

type BannerState = 'loading' | 'ready' | 'empty' | 'error';

@Component({
  selector: 'app-site-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-banner.html',
  styleUrl: './site-banner.css',
})
export class SiteBannerComponent implements OnInit {
  private readonly bannerService = inject(BannerService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pathImageSiteBanner = environment.siteBannerImagePath;
  protected readonly state = signal<BannerState>('loading');
  protected readonly bannerUrl = signal<string | null>(null);
  protected readonly imageLoaded = signal(false);

  /** Fallback so the home page always exposes a meaningful <h1>. */
  protected readonly fallbackHeading = 'مطب دکتر رکسانا حق پرست';
  protected readonly tagline = 'متخصص و جراح چشم، فلوشیپ فوق تخصصی قرنیه و خارج چشمی';

  ngOnInit(): void {
    this.loadBanner();
  }

  protected loadBanner(): void {
    this.state.set('loading');
    this.imageLoaded.set(false);

    this.bannerService
      .getBanner()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (banner) => {
          const url = banner?.imageUrl?.trim() ?? '';

          this.bannerUrl.set(url || null);
          this.state.set(url ? 'ready' : 'empty');
        },
        error: () => {
          this.bannerUrl.set(null);
          this.state.set('error');
        },
      });
  }

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  /** A broken image URL must not leave the shimmer running forever. */
  protected onImageError(): void {
    this.imageLoaded.set(false);
    this.state.set('error');
  }
}
