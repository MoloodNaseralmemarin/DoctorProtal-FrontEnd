import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FooterService } from '../../core/services/footer.service';
import { SocialDto } from '../../core/models/footer.model';
import { ClinicPhone, resolveClinicContact } from '../../core/constants/clinic-contact';
import { PUBLIC_NAV_LINKS } from '../../core/constants/navigation';
import { lockBodyScroll, unlockBodyScroll } from '../../core/ui/body-scroll-lock';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly footerService = inject(FooterService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly navLinks = PUBLIC_NAV_LINKS;

  /**
   * The single clinic number, read from the footer payload so the header and
   * the footer can never advertise different numbers.
   */
  protected readonly phone = signal<ClinicPhone | null>(null);

  protected readonly isMenuOpen = signal(false);
  protected readonly socialLinks = signal<readonly SocialDto[]>([]);

  ngOnInit(): void {
    // Social links and the phone number are part of the footer payload. The
    // service shares the response, so this is the same request the footer uses.
    this.footerService
      .getFooter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.socialLinks.set(data?.social ?? []);
          this.phone.set(resolveClinicContact(data?.address?.phone).phone);
        },
        error: () => {
          this.socialLinks.set([]);
          this.phone.set(null);
        },
      });
  }

  ngOnDestroy(): void {
    // Never leave a locked scroll position behind if the layout is destroyed
    // while the overlay menu is open.
    unlockBodyScroll();
  }

  protected toggleMenu(): void {
    this.setMenuOpen(!this.isMenuOpen());
  }

  protected closeMenu(): void {
    if (!this.isMenuOpen()) {
      return;
    }

    this.setMenuOpen(false);
  }

  private setMenuOpen(open: boolean): void {
    this.isMenuOpen.set(open);

    if (open) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }
}
