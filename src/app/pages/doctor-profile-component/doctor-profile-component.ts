import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DoctorProfile } from '../../../models/doctor-profile.model';
import { DoctorProfileService } from '../../services/doctor-profile-service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-doctor-profile-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-profile-component.html',
  styleUrl: './doctor-profile-component.css',
})
export class DoctorProfileComponent implements OnInit {
  doctor!: DoctorProfile;
  
    private readonly doctorProfileService = inject(DoctorProfileService);
    private readonly cdr = inject(ChangeDetectorRef);
    doctorImagePath = environment.doctorImagePath;

  ngOnInit(): void {
    // Initial data to prevent empty screen while loading
    this.doctor = {
      fullName: 'دکتر رکسانا حق پرست',
      clinicInfo:'متخصص و جراح چشم، فلوشیپ فوق تخصصی قرنیه و خارج چشمی. ارائه دهنده کلیه خدمات تشخیصی و درمانی بیماری‌های چشم با بهره‌گیری از مدرن‌ترین تجهیزات روز دنیا.',
      education: 'مدرک تخصصی چشم‌پزشکی',
      services: 'مشاوره‌های تخصصی در زمینه جراحی‌های چشم',
    };

    this.doctorProfileService.getDoctorProfile().subscribe({
      next: (data) => {
        if (data) {
          this.doctor = {
            ...data,
            // Provide sensible defaults for optional UI fields if missing from API
            education: data.education || 'مدرک تخصصی چشم پزشکی',
            services: data.services || 'مشاوره های تخصصی در زمینه جراحی های چشم',
          };
          // The app runs zoneless, so refresh the view once the data arrives.
          this.cdr.detectChanges();
        }
      },
      error: () => {
        console.warn('Error fetching doctor profile');
      },
    });
  }
}
