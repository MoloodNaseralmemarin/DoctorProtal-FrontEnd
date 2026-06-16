import { Component, OnInit } from '@angular/core';
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

  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.getFooter().subscribe({
      next: (data) => {
        this.footer = data;
      },
      error: (err) => {
        console.error('Footer load error', err);
      }
    });
  }
}
