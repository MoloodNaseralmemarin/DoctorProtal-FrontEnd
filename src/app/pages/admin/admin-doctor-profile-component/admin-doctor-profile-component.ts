import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DoctorProfile } from '../../../../models/doctor-profile.model';
import { DoctorProfileService } from '../../../services/doctor-profile-service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { RichTextEditorComponent } from '../../../shared/rich-text-editor/rich-text-editor';
import { RichTextPipe } from '../../../shared/rich-text';

@Component({
  selector: 'app-admin-doctor-profile-component',
  imports: [CommonModule, FormsModule, RichTextEditorComponent, RichTextPipe],
  standalone: true,
  templateUrl: './admin-doctor-profile-component.html',
  styleUrl: './admin-doctor-profile-component.css',
})
export class AdminDoctorProfileComponent implements OnInit {
  private service = inject(DoctorProfileService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  doctor: DoctorProfile = {
    fullName: '',
    clinicInfo: '',
  };

  isSubmitting = false;

  ngOnInit(): void {
    this.service.getDoctorProfile().subscribe({
      next: (res) => {
        if (res) {
          this.doctor = res;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.toastService.show('خطا در بارگذاری اطلاعات', 'error');
      },
    });
  }

  onSubmit() {
    if (!this.doctor.fullName || !this.doctor.clinicInfo) {
      this.toastService.show('لطفا تمام فیلدها را پر کنید', 'error');
      return;
    }

    this.isSubmitting = true;
    this.service.update(this.doctor).subscribe({
      next: () => {
        this.toastService.show('اطلاعات پروفایل با موفقیت بروزرسانی شد', 'success');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.show('خطا در ذخیره‌سازی اطلاعات', 'error');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}
