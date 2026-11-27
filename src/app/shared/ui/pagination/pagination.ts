import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * Page selector for the public list sections (gallery, eye-care tips).
 * It renders nothing when there is a single page, so callers can place it
 * unconditionally.
 */
@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav
        class="flex justify-center items-center gap-2 mt-12"
        [attr.aria-label]="label()"
      >
        <button
          type="button"
          (click)="goTo(page() - 1)"
          [disabled]="page() <= 1"
          aria-label="صفحه قبل"
          class="w-10 h-10 rounded-xl border border-cream-200 bg-white text-emerald-900 hover:bg-cream-100 disabled:opacity-40 transition-colors"
        >
          <i class="fas fa-chevron-right text-xs" aria-hidden="true"></i>
        </button>

        @for (number of pages(); track number) {
          <button
            type="button"
            (click)="goTo(number)"
            [attr.aria-current]="number === page() ? 'page' : null"
            class="w-10 h-10 rounded-xl font-bold transition-all"
            [class.bg-emerald-700]="number === page()"
            [class.text-white]="number === page()"
            [class.border]="number !== page()"
            [class.border-cream-200]="number !== page()"
            [class.bg-white]="number !== page()"
            [class.hover:bg-cream-100]="number !== page()"
          >
            {{ number }}
          </button>
        }

        <button
          type="button"
          (click)="goTo(page() + 1)"
          [disabled]="page() >= totalPages()"
          aria-label="صفحه بعد"
          class="w-10 h-10 rounded-xl border border-cream-200 bg-white text-emerald-900 hover:bg-cream-100 disabled:opacity-40 transition-colors"
        >
          <i class="fas fa-chevron-left text-xs" aria-hidden="true"></i>
        </button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly label = input('صفحه‌بندی');

  readonly pageChange = output<number>();

  protected readonly pages = computed(() =>
    Array.from({ length: Math.max(0, this.totalPages()) }, (_, index) => index + 1),
  );

  protected goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) {
      return;
    }

    this.pageChange.emit(page);
  }
}
