import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FooterDto } from '../../../models/footer.model';
import { FooterService } from '../../services/footer-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-component',
  imports: [CommonModule],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
})
export class FooterComponent implements OnInit {

  footer!: FooterDto;

  constructor(
    private footerService: FooterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.footerService.getFooter().subscribe({
      next: (data) => {
        this.footer = data;
        // The app runs zoneless, so refresh the view explicitly once the data arrives.
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Footer load error', err);
      }
    });
  }
}
