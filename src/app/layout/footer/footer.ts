import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterDto } from '../../core/models/footer.model';
import { FooterService } from '../../core/services/footer.service';
import { ClinicPhone, resolveClinicContact } from '../../core/constants/clinic-contact';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent implements OnInit {
  private readonly footerService = inject(FooterService);

  /**
   * `null` until the API answers. The template renders a data-free shell in
   * that case, so a failed request can never remove the footer from the page.
   */
  protected readonly footer = signal<FooterDto | null>(null);

  /** The one clinic number, resolved from the footer payload the header also uses. */
  protected readonly phone = signal<ClinicPhone | null>(null);

  /** `address.lines` plus any address text the API parked in a phone field. */
  protected readonly addressLines = signal<readonly string[]>([]);

  protected readonly address = computed(() => this.footer()?.address ?? null);
  protected readonly services = computed(() => this.footer()?.services ?? []);
  protected readonly socialLinks = computed(() => this.footer()?.social ?? []);

  ngOnInit(): void {
    this.footerService.getFooter().subscribe({
      next: (data) => {
        const lines = data?.address?.lines ?? [];
        const contact = resolveClinicContact(data?.address?.phone);

        this.footer.set(data);
        this.phone.set(contact.phone);
        this.addressLines.set(lines.length ? lines : contact.addressExtras);
      },
      error: () => this.footer.set(null),
    });
  }
}
