import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DoctorProfile } from '../../../core/models/doctor-profile.model';
import { DoctorProfileService } from '../../../core/services/doctor-profile.service';
import { ToastService } from '../../../core/services/toast.service';
import { RichTextEditorComponent } from '../../../shared/rich-text-editor/rich-text-editor';
import { RichTextPipe } from '../../../shared/pipes/rich-text.pipe';
import { apiErrorMessage } from '../../../core/http/api-error';

/** Edits the public doctor profile (name, bio, education, services, photo). */
@Component({
  selector: 'app-doctor-profile-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RichTextEditorComponent, RichTextPipe],
  templateUrl: './doctor-profile-admin.html',
  styleUrl: './doctor-profile-admin.css',
})
export class AdminDoctorProfileComponent implements OnInit {
  private readonly service = inject(DoctorProfileService);
  private readonly toast = inject(ToastService);

  /** Template-driven form model, mutated by `ngModel`. */
  protected doctor: DoctorProfile = {
    fullName: '',
    clinicInfo: '',
  };

  protected readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this.service.getDoctorProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.doctor = profile;
        }
      },
      error: (error: unknown) => this.toast.error(apiErrorMessage(error)),
    });
  }

  protected onSubmit(): void {
    if (!this.doctor.fullName?.trim() || !this.doctor.clinicInfo?.trim()) {
      this.toast.error('لطفا تمام فیلدها را پر کنید');
      return;
    }

    this.isSubmitting.set(true);

    this.service.update(this.doctor).subscribe({
      next: () => {
        this.toast.success('اطلاعات پروفایل با موفقیت بروزرسانی شد');
        this.isSubmitting.set(false);
      },
      error: (error: unknown) => {
        this.toast.error(apiErrorMessage(error));
        this.isSubmitting.set(false);
      },
    });
  }
}
