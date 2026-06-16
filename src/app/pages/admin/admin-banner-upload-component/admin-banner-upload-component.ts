import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { SiteBannerDto } from '../../../../models/siteBannerDto.model';
import { BannerService } from '../../../services/banner';


@Component({
  selector: 'app-admin-banner-upload-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-banner-upload-component.html',
  styleUrl: './admin-banner-upload-component.css',
})
export class AdminBannerUploadComponent implements OnInit {
  currentBanner: SiteBannerDto | null = null;
  selectedFile: File | null = null;
  photoPreview: string | null = null;
  caption = '';
  isSubmitting = false;

  constructor(
    private readonly bannerService: BannerService,
    private readonly cdr: ChangeDetectorRef,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadCurrentBanner();
  }

  loadCurrentBanner(): void {
    this.bannerService.getBanner().subscribe({
      next: (banner) => {
        this.currentBanner = banner;
        if (!this.caption) {
          this.caption = banner.caption;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading current banner', err),
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.toastService.error('لطفاً یک عکس انتخاب کنید');
      return;
    }

    this.isSubmitting = true;

    this.bannerService.updateBanner(this.selectedFile, this.caption).subscribe({
      next: () => {
        this.toastService.success('بنر با موفقیت ذخیره شد');
        this.resetForm();
        this.loadCurrentBanner();
      },
      error: () => {
        this.toastService.error('خطا در ذخیره بنر');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.photoPreview = null;
    this.caption = '';
    this.isSubmitting = false;
    this.cdr.detectChanges();
  }
}
