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

import { ServiceDto } from '../../../core/models/service.model';
import { ServiceCatalogService } from '../../../core/services/service-catalog.service';
import { ToastService } from '../../../core/services/toast.service';
import { RichTextEditorComponent } from '../../../shared/rich-text-editor/rich-text-editor';
import { apiErrorMessage } from '../../../core/http/api-error';

const EMPTY_MODEL: Partial<ServiceDto> = {
  title: '',
  description: '',
  isActive: true,
};

/**
 * Create, edit and delete the clinic services rendered on the public home
 * page. Descriptions are rich text (CKEditor) and are sanitised by the
 * `richText` pipe when the public modal renders them.
 */
@Component({
  selector: 'app-admin-service',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  templateUrl: './service-admin.html',
  styleUrl: './service-admin.css',
})
export class AdminServiceComponent implements OnInit {
  private readonly service = inject(ServiceCatalogService);
  private readonly toast = inject(ToastService);

  protected readonly services = signal<readonly ServiceDto[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);

  protected model: Partial<ServiceDto> = { ...EMPTY_MODEL };

  protected readonly filteredServices = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.services();
    }

    return this.services().filter((service) => (service.title ?? '').toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.isLoading.set(true);

    this.service.getAdminAll(1, 100).subscribe({
      next: (result) => {
        this.services.set(result.items);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.toast.error(apiErrorMessage(error));
      },
    });
  }

  protected startCreate(): void {
    this.editingId.set(null);
    this.model = { ...EMPTY_MODEL };
    this.showForm.set(true);
  }

  protected edit(service: ServiceDto): void {
    this.editingId.set(service.id);
    this.model = {
      title: service.title,
      description: service.description ?? '',
      isActive: service.isActive ?? true,
    };
    this.showForm.set(true);
  }

  protected save(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (!this.model.title?.trim()) {
      this.toast.error('عنوان خدمت را وارد کنید');
      return;
    }

    this.isSubmitting.set(true);

    const id = this.editingId();
    const request$ = id
      ? this.service.update(id, this.model)
      : this.service.create(this.model);

    request$.subscribe({
      next: () => {
        this.toast.success(id ? 'خدمت با موفقیت ویرایش شد' : 'خدمت جدید ثبت شد');
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

  protected remove(service: ServiceDto): void {
    if (this.deletingId() !== null) {
      return;
    }

    if (!confirm(`آیا از حذف خدمت «${service.title}» اطمینان دارید؟`)) {
      return;
    }

    this.deletingId.set(service.id);

    this.service.delete(service.id).subscribe({
      next: () => {
        this.toast.success('خدمت با موفقیت حذف شد');
        this.deletingId.set(null);
        this.load();
      },
      error: (error: unknown) => {
        this.deletingId.set(null);
        this.toast.error(apiErrorMessage(error));
      },
    });
  }

  protected reset(): void {
    this.editingId.set(null);
    this.showForm.set(false);
    this.model = { ...EMPTY_MODEL };
  }

  /** Plain-text excerpt for the list; the stored value is HTML. */
  protected preview(html: string | null | undefined): string {
    const text = (html ?? '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.length > 90 ? `${text.slice(0, 90)}…` : text || '—';
  }
}
