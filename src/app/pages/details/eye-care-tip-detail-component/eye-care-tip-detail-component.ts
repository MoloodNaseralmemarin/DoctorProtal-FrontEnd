import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { EyeCareTip } from '../../../../models/eye-care-tip.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EyeCareTipService } from '../../../services/eye-care-tip-service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ArticleState = 'loading' | 'ready' | 'error' | 'notfound';

@Component({
  selector: 'app-eye-care-tip-detail-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eye-care-tip-detail-component.html',
  styleUrl: './eye-care-tip-detail-component.css',
})
export class EyeCareTipDetailComponent implements OnInit {

  readonly tip = signal<EyeCareTip | null>(null);
  readonly status = signal<ArticleState>('loading');

  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(EyeCareTipService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.load();
  }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.status.set('notfound');
      return;
    }

    this.status.set('loading');

    this.service
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tip) => {
          if (!tip) {
            this.status.set('notfound');
            return;
          }

          this.tip.set(tip);
          this.status.set('ready');
        },
        error: () => {
          this.tip.set(null);
          this.status.set('error');
        },
      });
  }
}
