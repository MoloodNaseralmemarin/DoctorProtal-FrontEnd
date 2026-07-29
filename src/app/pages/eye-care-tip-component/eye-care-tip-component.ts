import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EyeCareTip } from '../../../models/eye-care-tip.model';
import { EyeCareTipService } from '../../services/eye-care-tip-service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-eye-care-tip-component',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './eye-care-tip-component.html',
  styleUrls: ['./eye-care-tip-component.css']
})
export class EyeCareTipComponent implements OnInit {

  eyeCareImagePath = environment.eyeCareImagePath;
  tips: EyeCareTip[] = [];

  pageNumber = 1;
  pageSize = 3;
  totalCount = 0;

  pages: number[] = [];

  private readonly service = inject(EyeCareTipService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.load();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  load(): void {
    this.service.getAll(this.pageNumber, this.pageSize).subscribe({
      next: (res: any) => {

        this.tips = res.items || [];
        this.totalCount = res.totalCount || 0;
        this.pageNumber = res.pageNumber || 1;
        this.pageSize = res.pageSize || 3;

        this.pages = Array.from(
          { length: this.totalPages },
          (_, index) => index + 1
        );

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Load Error:', err);
        this.tips = [];
      }
    });
  }

  changePage(page: number): void {

    if (page === this.pageNumber) {
      return;
    }

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.pageNumber = page;
    this.load();
  }
}