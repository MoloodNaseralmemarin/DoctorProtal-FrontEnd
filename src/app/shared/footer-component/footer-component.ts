import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FooterDto } from '../../../models/footer.model';
import { FooterService } from '../../services/footer-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CLINIC_PHONES, ClinicPhones, resolveClinicPhones } from '../clinic-contact';

@Component({
  selector: 'app-footer-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
})
export class FooterComponent implements OnInit {

  /**
   * Undefined until the API answers. The template renders a data-free shell in
   * that case, so a failed request can never remove the footer from the page.
   */
  footer?: FooterDto;

  /**
   * Numbers shown in the contact card. Until the API answers they hold the
   * shared clinic numbers; `resolveClinicPhones` then maps the payload onto
   * them so the footer and the header always show the same numbers.
   */
  clinicPhones: ClinicPhones = CLINIC_PHONES;

  /** `address.lines` plus any address text the API parked in a phone field. */
  addressLines: string[] = [];

  constructor(
    private footerService: FooterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.footerService.getFooter().subscribe({
      next: (data) => {
        this.footer = data;

        const lines = data?.address?.lines ?? [];
        const phones = resolveClinicPhones(data?.address?.phone);

        this.clinicPhones = { landline: phones.landline, mobile: phones.mobile };
        this.addressLines = lines.length ? [...lines] : [...lines, ...phones.addressExtras];
        // The app runs zoneless, so refresh the view explicitly once the data arrives.
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Footer load error', err);
      }
    });
  }
}
