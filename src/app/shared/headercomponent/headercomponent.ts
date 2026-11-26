import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterService } from '../../services/footer-service';
import { FooterDto } from '../../../models/footer.model';
import { CLINIC_PHONES } from '../clinic-contact';

@Component({
  selector: 'app-headercomponent',
  imports: [CommonModule, RouterModule],
  templateUrl: './headercomponent.html',
  styleUrl: './headercomponent.css',
})
export class Headercomponent implements OnInit, OnDestroy {
  footerData?: FooterDto;
  isMenuOpen = false;

  /**
   * The clinic numbers come from the shared `CLINIC_PHONES` constant so the
   * header and the footer never advertise different numbers.
   */
  readonly clinicPhone = CLINIC_PHONES;

  constructor(
    private footerService: FooterService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.footerService.getFooter().subscribe({
      next: (data) => {
        this.footerData = data;
        // The app runs zoneless, so refresh the view once the data arrives.
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Header failed to load footer data', err);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    // Never leak a locked scroll position if the layout is destroyed while the
    // overlay menu is open.
    this.unlockScroll();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.syncScrollLock();
  }

  closeMenu(): void {
    if (!this.isMenuOpen) {
      return;
    }

    this.isMenuOpen = false;
    this.syncScrollLock();
  }

  private syncScrollLock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      this.unlockScroll();
    }
  }

  private unlockScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.body.style.overflow = 'auto';
  }
}
