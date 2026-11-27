import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastService } from '../../../core/services/toast.service';
import { BannerService } from '../../../core/services/banner.service';
import { SiteBannerDto } from '../../../core/models/site-banner.model';
import { environment } from '../../../../environments/environment';
import { apiErrorMessage } from '../../../core/http/api-error';

/** Replaces the home-page banner image and caption. */
@Component({
  selector: 'app-banner-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './banner-upload.html',
  styleUrl: './banner-upload.css',
})
export class AdminBannerUploadComponent implements OnInit {
  private readonly bannerService = inject(BannerService);
  private readonly toast = inject(ToastService);

  protected readonly bannerImagePath = environment.siteBannerImagePath;

  protected readonly currentBanner = signal<SiteBannerDto | null>(null);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly photoPreview = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  private caption = '';

  ngOnInit(): void {
    this.loadCurrentBanner();
  }

  protected loadCurrentBanner(): void {
    this.bannerService.getBanner().subscribe({
      next: (banner) => {
        this.currentBanner.set(banner);
        this.caption = banner?.caption ?? '';
      },
      error: (error: unknown) => this.toast.error(apiErrorMessage(error)),
    });
  }

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  }

  protected clearSelection(): void {
    this.selectedFile.set(null);
    this.photoPreview.set(null);
  }

  protected onSubmit(): void {
    const file = this.selectedFile();

    if (!file) {
      this.toast.error('لطفاً یک عکس انتخاب کنید');
      return;
    }

    this.isSubmitting.set(true);

    this.bannerService.updateBanner(file, this.caption).subscribe({
      next: () => {
        this.toast.success('بنر با موفقیت ذخیره شد');
        this.clearSelection();
        this.isSubmitting.set(false);
        this.loadCurrentBanner();
      },
      error: (error: unknown) => {
        this.toast.error(apiErrorMessage(error));
        this.isSubmitting.set(false);
      },
    });
  }
}
