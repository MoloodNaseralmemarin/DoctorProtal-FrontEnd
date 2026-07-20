import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerService } from '../../services/banner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

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

  readonly bannerUrl = signal<string | null>(null);
  readonly isLoading = signal(true);
  readonly imageVisible = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadBanner();
  }

  loadBanner(): void {
    this.isLoading.set(true);

    this.bannerService
      .getBanner()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (banner) => {
          this.bannerUrl.set(banner?.imageUrl ?? null);
        },
        error: (err) => {
          this.error.set('خطا در دریافت بنر');
        },
      });
  }

  onImageLoad(): void {
    this.imageVisible.set(true);
  }
}
