import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EyeCareTip } from '../../../core/models/eye-care-tip.model';
import { EyeCareTipService } from '../../../core/services/eye-care-tip.service';
import { environment } from '../../../../environments/environment';
import { PaginationComponent } from '../../../shared/ui/pagination/pagination';

type ListState = 'loading' | 'ready' | 'empty' | 'error';

const PAGE_SIZE = 3;

@Component({
  selector: 'app-eye-care-tip-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './eye-care-tip-list.html',
  styleUrl: './eye-care-tip-list.css',
})
export class EyeCareTipListComponent implements OnInit {
  private readonly service = inject(EyeCareTipService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly eyeCareImagePath = environment.eyeCareImagePath;

  protected readonly tips = signal<readonly EyeCareTip[]>([]);
  protected readonly status = signal<ListState>('loading');
  protected readonly pageNumber = signal(1);
  protected readonly totalCount = signal(0);

  protected readonly totalPages = computed(() => Math.ceil(this.totalCount() / PAGE_SIZE));

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.status.set('loading');

    this.service
      .getPublicAll(this.pageNumber(), PAGE_SIZE)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.tips.set(result.items);
          this.totalCount.set(result.totalCount);
          this.pageNumber.set(result.pageNumber);
          this.status.set(result.items.length ? 'ready' : 'empty');
        },
        error: () => {
          this.tips.set([]);
          this.totalCount.set(0);
          this.status.set('error');
        },
      });
  }

  protected changePage(page: number): void {
    this.pageNumber.set(page);
    this.load();
  }
}
