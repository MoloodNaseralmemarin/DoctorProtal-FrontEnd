import { Component, OnInit } from '@angular/core';
import { DoctorProfile } from '../../../models/doctor-profile.model';
import { DoctorProfileService } from '../../services/doctor-profile-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-profile-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-profile-component.html',
  styleUrl: './doctor-profile-component.css',
})
export class DoctorProfileComponent implements OnInit {
  doctor!: DoctorProfile;

  constructor(private doctorProfileService: DoctorProfileService) {}

  ngOnInit(): void {
    // Initial data to prevent empty screen while loading
    this.doctor = {
      fullName: 'دکتر نام پزشک شما',
      clinicInfo:
        'متخصص و جراح چشم، فلوشیپ فوق تخصصی قرنیه و خارج چشمی. ارائه دهنده کلیه خدمات تشخیصی و درمانی بیماری‌های چشم با بهره‌گیری از مدرن‌ترین تجهیزات روز دنیا.',
      specialty: 'بورد تخصصی ناسیونال',
      education: 'فلوشیپ فوق تخصصی قرنیه',
      services: 'جراحی‌های نوین چشم و لیزیک',
    };

    this.doctorProfileService.getDoctorProfile().subscribe({
      next: (data) => {
        if (data) {
          this.doctor = {
            ...data,
            // Provide sensible defaults for optional UI fields if missing from API
            specialty: data.specialty || 'بورد تخصصی',
            education: data.education || 'فلوشیپ فوق تخصصی از مراکز معتبر علمی و درمانی',
            services: data.services || 'ارائه دهنده نوین‌ترین متدهای تشخیصی و درمانی',
          };
        }
      },
      error: () => {
        console.warn('Error fetching doctor profile');
      },
    });
  }
}
