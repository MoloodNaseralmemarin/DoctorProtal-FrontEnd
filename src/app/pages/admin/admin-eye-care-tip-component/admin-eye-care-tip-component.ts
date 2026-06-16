import { Component, OnInit, ChangeDetectorRef, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { EyeCareTipService } from '../../../services/eye-care-tip-service';
import { EyeCareTip } from '../../../../models/eye-care-tip.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-eye-care-tip-component',
  standalone: true,
  imports: [CommonModule, FormsModule, CKEditorModule],
  templateUrl: './admin-eye-care-tip-component.html',
  styleUrl: './admin-eye-care-tip-component.css',
})
export class AdminEyeCareTipComponent implements OnInit {
  private readonly service = inject(EyeCareTipService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastService = inject(ToastService);

  public Editor = DecoupledEditor;
  public editorConfig = {
    placeholder: 'توضیحات نکته را اینجا بنویسید...',
    language: 'fa',
    contentsLangDirection: 'rtl'
  };

  tips = signal<EyeCareTip[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  searchTerm = signal('');

  // Pagination
  currentPage = signal(1);
  pageSize = signal(5);
  Math = Math;

  filteredTips = computed(() => {
    const tips = this.tips();
    if (!Array.isArray(tips)) return [];

    const term = this.searchTerm().toLowerCase();
    return tips.filter(t =>
      (t?.title?.toLowerCase() || '').includes(term)
    );
  });

  paginatedTips = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredTips().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.ceil(this.filteredTips().length / this.pageSize()));

  model: Partial<EyeCareTip> = {
    title: '',
    description: '',
    isActive: true,
  };

  editingId: number | null = null;
  showForm = false;

  ngOnInit(): void {
    this.load();
  }

  public onReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  load(): void {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res.filter(x => x !== null) : [];
        this.tips.set(data);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.show('خطا در بارگذاری نکات مراقبتی', 'error');
        this.isLoading.set(false);
      },
    });
  }

  save(): void {
    if (!this.model.title || !this.model.description) {
      this.toastService.show('لطفا تمام فیلدها را پر کنید', 'error');
      return;
    }

    this.isSubmitting.set(true);
    const action$ = this.editingId
      ? this.service.update(this.editingId, this.model)
      : this.service.create(this.model);

    action$.subscribe({
      next: () => {
        this.toastService.show(this.editingId ? 'بروزرسانی با موفقیت انجام شد' : 'نکته جدید با موفقیت ثبت شد', 'success');
        this.reset();
        this.load();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.toastService.show('خطا در انجام عملیات', 'error');
        this.isSubmitting.set(false);
      },
    });
  }

  edit(item: EyeCareTip): void {
    this.editingId = item.id;
    this.model = { ...item };
    this.showForm = true;
  }

  remove(id: number): void {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.toastService.show('مورد با موفقیت حذف شد', 'success');
        this.load();
      },
      error: () => this.toastService.show('خطا در حذف مورد', 'error')
    });
  }

  reset(): void {
    this.editingId = null;
    this.showForm = false;
    this.model = {
      title: '',
      description: '',
      isActive: true,
    };
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
  }
}