import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EyeCareTip } from '../../../core/models/eye-care-tip.model';
import { EyeCareTipService } from '../../../core/services/eye-care-tip.service';
import { ToastService } from '../../../core/services/toast.service';
import { RichTextEditorComponent } from '../../../shared/rich-text-editor/rich-text-editor';
import { apiErrorMessage } from '../../../core/http/api-error';

const EMPTY_MODEL: Partial<EyeCareTip> = {
  title: '',
  description: '',
  bodyText: '',
  isActive: true,
};

/**
 * Create/edit/delete short eye-care tips. The API page is fetched once and the
 * admin screen paginates the list locally, so search stays instant.
 */
@Component({
  selector: 'app-eye-care-tip-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  templateUrl: './eye-care-tip-admin.html',
  styleUrl: './eye-care-tip-admin.css',
})
export class AdminEyeCareTipComponent implements OnInit {
  private readonly service = inject(EyeCareTipService);
  private readonly toast = inject(ToastService);

  protected readonly tips = signal<readonly EyeCareTip[]>([]);
  protected readonly isSubmitting = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(5);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);

  protected model: Partial<EyeCareTip> = { ...EMPTY_MODEL };

  protected readonly filteredTips = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.tips();
    }

    return this.tips().filter((tip) => (tip.title ?? '').toLowerCase().includes(term));
  });

  protected readonly paginatedTips = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();

    return this.filteredTips().slice(start, start + this.pageSize());
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredTips().length / this.pageSize())),
  );

  protected readonly rangeStart = computed(() =>
    this.filteredTips().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  protected readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.filteredTips().length),
  );

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    // The admin screen paginates locally, so fetch a large enough page.
    this.service.getAdminAll(1, 100).subscribe({
      next: (result) => this.tips.set(result.items),
      error: (error: unknown) => this.toast.error(apiErrorMessage(error)),
    });
  }

  protected startCreate(): void {
    this.editingId.set(null);
    this.model = { ...EMPTY_MODEL };
    this.showForm.set(true);
  }

  protected edit(tip: EyeCareTip): void {
    this.editingId.set(tip.id);
    this.model = { ...tip };
    this.showForm.set(true);
  }

  protected save(): void {
    if (!this.model.title?.trim() || !this.model.bodyText?.trim()) {
      this.toast.error('لطفا تمام فیلدها را پر کنید');
      return;
    }

    // The list cards use `description`; derive it from the body when the
    // administrator did not provide a separate summary.
    if (!this.model.description?.trim()) {
      this.model.description = this.toPlainText(this.model.bodyText ?? '');
    }

    this.isSubmitting.set(true);

    const id = this.editingId();
    const request$ = id ? this.service.update(id, this.model) : this.service.create(this.model);

    request$.subscribe({
      next: () => {
        this.toast.success(id ? 'بروزرسانی با موفقیت انجام شد' : 'نکته جدید با موفقیت ثبت شد');
        this.reset();
        this.load();
        this.isSubmitting.set(false);
      },
      error: (error: unknown) => {
        this.toast.error(apiErrorMessage(error));
        this.isSubmitting.set(false);
      },
    });
  }

  protected remove(id: number): void {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        this.toast.success('مورد با موفقیت حذف شد');
        this.load();
      },
      error: (error: unknown) => this.toast.error(apiErrorMessage(error)),
    });
  }

  protected reset(): void {
    this.editingId.set(null);
    this.showForm.set(false);
    this.model = { ...EMPTY_MODEL };
  }

  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  private toPlainText(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);
  }
}
