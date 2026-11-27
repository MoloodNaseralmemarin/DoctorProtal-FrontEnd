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
import { CLINIC_PHONES } from '../../core/constants/clinic-contact';
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
   * The clinic numbers come from the shared `CLINIC_PHONES` constant so the
   * header and the footer never advertise different numbers.
   */
  protected readonly clinicPhone = CLINIC_PHONES;

  protected readonly isMenuOpen = signal(false);
  protected readonly socialLinks = signal<readonly SocialDto[]>([]);

  ngOnInit(): void {
    // Social links are part of the footer payload; the header renders the same
    // list in its top bar and mobile drawer.
    this.footerService
      .getFooter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.socialLinks.set(data?.social ?? []),
        error: () => this.socialLinks.set([]),
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
