import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DoctorProfile } from '../../core/models/doctor-profile.model';
import { DoctorProfileService } from '../../core/services/doctor-profile.service';
import { environment } from '../../../environments/environment';
import { RichTextPipe } from '../../shared/pipes/rich-text.pipe';

/**
 * Content shown before the API answers; it also acts as the fallback when the
 * profile request fails, so the section never renders empty.
 */
const DEFAULT_PROFILE: DoctorProfile = {
  fullName: 'دکتر رکسانا حق پرست',
  clinicInfo:
    'متخصص و جراح چشم، فلوشیپ فوق تخصصی قرنیه و خارج چشمی. ارائه دهنده کلیه خدمات تشخیصی و درمانی بیماری‌های چشم با بهره‌گیری از مدرن‌ترین تجهیزات روز دنیا.',
  education: 'مدرک تخصصی چشم‌پزشکی',
  services: 'مشاوره‌های تخصصی در زمینه جراحی‌های چشم',
};

@Component({
  selector: 'app-doctor-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RichTextPipe],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfileComponent implements OnInit {
  private readonly doctorProfileService = inject(DoctorProfileService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly doctorImagePath = environment.doctorImagePath;
  protected readonly doctor = signal<DoctorProfile>(DEFAULT_PROFILE);

  ngOnInit(): void {
    this.doctorProfileService
      .getDoctorProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          if (!data) {
            return;
          }

          this.doctor.set({
            ...data,
            education: data.education || DEFAULT_PROFILE.education,
            services: data.services || DEFAULT_PROFILE.services,
          });
        },
        // Keep the defaults: the section still shows a complete profile.
        error: () => undefined,
      });
  }
}
