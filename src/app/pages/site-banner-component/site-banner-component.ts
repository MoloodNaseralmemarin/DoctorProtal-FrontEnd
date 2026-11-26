import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerService } from '../../services/banner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

type BannerState = 'loading' | 'ready' | 'empty' | 'error';

@Component({
  selector: 'app-site-banner-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './site-banner-component.html',
  styleUrls: ['./site-banner-component.css'],
})
export class SiteBannerComponent implements OnInit {
  private readonly bannerService = inject(BannerService);
  private readonly destroyRef = inject(DestroyRef);
  pathImageSiteBanner = environment.siteBannerImagePath;

  readonly state = signal<BannerState>('loading');
  readonly bannerUrl = signal<string | null>(null);
  readonly caption = signal<string>('');
  readonly imageLoaded = signal(false);

  /** Fallback so the home page always exposes a meaningful <h1>. */
  readonly fallbackHeading = 'مطب دکتر رکسانا حق پرست';
  readonly tagline = 'متخصص و جراح چشم، فلوشیپ فوق تخصصی قرنیه و خارج چشمی';

  ngOnInit(): void {
    this.loadBanner();
  }

  loadBanner(): void {
    this.state.set('loading');
    this.imageLoaded.set(false);

    this.bannerService
      .getBanner()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (banner) => {
          const url = banner?.imageUrl?.trim() ?? '';
          this.caption.set(banner?.caption?.trim() ?? '');
          this.bannerUrl.set(url || null);
          this.state.set(url ? 'ready' : 'empty');
        },
        error: () => {
          this.bannerUrl.set(null);
          this.state.set('error');
        },
      });
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  /** A broken image URL must not leave the shimmer running forever. */
  onImageError(): void {
    this.imageLoaded.set(false);
    this.state.set('error');
  }
}
