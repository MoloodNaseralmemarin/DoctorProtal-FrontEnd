import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { Blog } from '../../../../models/blog.model';
import { BlogService } from '../../../services/blog-service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-blog-component',
  standalone: true,
  imports: [CommonModule, FormsModule, CKEditorModule],
  templateUrl: './admin-blog-component.html',
  styleUrl: './admin-blog-component.css',
})
export class AdminBlogComponent implements OnInit {

  private readonly service = inject(BlogService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastService = inject(ToastService);

  public Editor = DecoupledEditor;

  public editorConfig = {
    placeholder: 'متن کامل مقاله را اینجا بنویسید...',
    language: 'fa',
    contentsLangDirection: 'rtl'
  };

  blogs = signal<Blog[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);

  searchTerm = signal('');

  currentPage = signal(1);
  pageSize = signal(5);
  totalCount = signal(0);

  Math = Math;

  model: Partial<Blog> = {
    title: '',
    description: '',
    bodyText: '',
    isActive: true
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

    this.service.getAll(
      this.currentPage(),
      this.pageSize(),
      this.searchTerm()
    ).subscribe({
      next: (res: any) => {

        // اگر API فقط آرایه برگرداند
        if (Array.isArray(res)) {
          this.blogs.set(res);
          this.totalCount.set(res.length);
        }

        // اگر API به صورت Paging برگرداند
        else {
          this.blogs.set(res.items ?? res.data ?? []);
          this.totalCount.set(
            res.totalCount ??
            res.totalItems ??
            0
          );
        }

        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.show(
          'خطا در بارگذاری لیست بلاگ‌ها',
          'error'
        );
        this.isLoading.set(false);
      }
    });
  }

  search(): void {
    this.currentPage.set(1);
    this.load();
  }

  save(): void {

    if (
      !this.model.title ||
      !this.model.description ||
      !this.model.bodyText
    ) {
      this.toastService.show(
        'لطفا تمام فیلدها را پر کنید',
        'error'
      );
      return;
    }

    this.isSubmitting.set(true);

    const action$ = this.editingId
      ? this.service.update(this.editingId, this.model)
      : this.service.create(this.model);

    action$.subscribe({
      next: () => {

        this.toastService.show(
          this.editingId
            ? 'بروزرسانی با موفقیت انجام شد'
            : 'بلاگ جدید با موفقیت ثبت شد',
          'success'
        );

        this.reset();
        this.load();

        this.isSubmitting.set(false);
      },
      error: () => {

        this.toastService.show(
          'خطا در انجام عملیات',
          'error'
        );

        this.isSubmitting.set(false);
      }
    });
  }

  edit(item: Blog): void {
    this.editingId = item.id;
    this.model = { ...item };
    this.showForm = true;
  }

  remove(id: number): void {

    if (!confirm('آیا از حذف این بلاگ اطمینان دارید؟')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        this.toastService.show(
          'بلاگ با موفقیت حذف شد',
          'success'
        );

        this.load();
      },
      error: () => {
        this.toastService.show(
          'خطا در حذف بلاگ',
          'error'
        );
      }
    });
  }

  reset(): void {

    this.editingId = null;
    this.showForm = false;

    this.model = {
      title: '',
      description: '',
      bodyText: '',
      isActive: true
    };
  }

  get totalPages(): number {

    return Math.ceil(
      this.totalCount() / this.pageSize()
    );
  }

  prevPage(): void {

    if (this.currentPage() > 1) {

      this.currentPage.update(p => p - 1);

      this.load();
    }
  }

  nextPage(): void {

    if (this.currentPage() < this.totalPages) {

      this.currentPage.update(p => p + 1);

      this.load();
    }
  }
}