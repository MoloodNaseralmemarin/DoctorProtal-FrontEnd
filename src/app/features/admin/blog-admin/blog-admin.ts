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

import { Blog } from '../../../core/models/blog.model';
import { BlogService } from '../../../core/services/blog.service';
import { ToastService } from '../../../core/services/toast.service';
import { RichTextEditorComponent } from '../../../shared/rich-text-editor/rich-text-editor';
import { apiErrorMessage } from '../../../core/http/api-error';

const EMPTY_MODEL: Partial<Blog> = {
  title: '',
  description: '',
  bodyText: '',
  isActive: true,
};

/** Create/edit/delete blog articles. The list itself is paginated by the API. */
@Component({
  selector: 'app-admin-blog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  templateUrl: './blog-admin.html',
  styleUrl: './blog-admin.css',
})
export class AdminBlogComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly toast = inject(ToastService);

  protected readonly blogs = signal<readonly Blog[]>([]);
  protected readonly isSubmitting = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(5);
  protected readonly totalCount = signal(0);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);

  /** Template-driven form model; replaced as a whole when an article is edited. */
  protected model: Partial<Blog> = { ...EMPTY_MODEL };

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.pageSize())),
  );

  protected readonly rangeStart = computed(() =>
    this.totalCount() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  protected readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalCount()),
  );

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.blogService.getAll(this.currentPage(), this.pageSize(), this.searchTerm()).subscribe({
      next: (result) => {
        this.blogs.set(result.items);
        this.totalCount.set(result.totalCount);
      },
      error: (error: unknown) => this.toast.error(apiErrorMessage(error)),
    });
  }

  protected search(): void {
    this.currentPage.set(1);
    this.load();
  }

  protected startCreate(): void {
    this.editingId.set(null);
    this.model = { ...EMPTY_MODEL };
    this.showForm.set(true);
  }

  protected edit(blog: Blog): void {
    this.editingId.set(blog.id);
    this.model = { ...blog };
    this.showForm.set(true);
  }

  protected save(): void {
    if (!this.model.title?.trim() || !this.model.description?.trim() || !this.model.bodyText?.trim()) {
      this.toast.error('لطفا تمام فیلدها را پر کنید');
      return;
    }

    this.isSubmitting.set(true);

    const id = this.editingId();
    const request$ = id
      ? this.blogService.update(id, this.model)
      : this.blogService.create(this.model);

    request$.subscribe({
      next: () => {
        this.toast.success(id ? 'بروزرسانی با موفقیت انجام شد' : 'بلاگ جدید ثبت شد');
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
    if (!confirm('آیا از حذف این بلاگ اطمینان دارید؟')) {
      return;
    }

    this.blogService.delete(id).subscribe({
      next: () => {
        this.toast.success('بلاگ حذف شد');
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
    if (this.currentPage() <= 1) {
      return;
    }

    this.currentPage.update((page) => page - 1);
    this.load();
  }

  protected nextPage(): void {
    if (this.currentPage() >= this.totalPages()) {
      return;
    }

    this.currentPage.update((page) => page + 1);
    this.load();
  }
}
