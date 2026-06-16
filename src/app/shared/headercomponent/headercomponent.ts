import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FooterService } from '../../services/footer-service';
import { FooterDto } from '../../../models/footer.model';

@Component({
  selector: 'app-headercomponent',
  imports: [CommonModule],
  templateUrl: './headercomponent.html',
  styleUrl: './headercomponent.css',
})
export class Headercomponent implements OnInit {
  footerData?: FooterDto;
  isMenuOpen = false;

  constructor(
    private footerService: FooterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.footerService.getFooter().subscribe({
      next: (data) => {
        this.footerData = data;
      },
      error: (err) => {
        console.error('Header failed to load footer data', err);
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }
}
