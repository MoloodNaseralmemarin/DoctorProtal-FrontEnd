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

/**
 * Create blog articles. The list is fetched in one page and searched locally
 * because the API exposes no title filter. Editing and deleting are not
 * supported by the backend (there are no PUT/DELETE routes).
 */
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
  protected readonly showForm = signal(false);

  /** Template-driven form model; replaced as a whole after a successful save. */
  protected model: Partial<Blog> = { ...EMPTY_MODEL };

  protected readonly filteredBlogs = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.blogs();
    }

    return this.blogs().filter((blog) => (blog.title ?? '').toLowerCase().includes(term));
  });

  protected readonly paginatedBlogs = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();

    return this.filteredBlogs().slice(start, start + this.pageSize());
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredBlogs().length / this.pageSize())),
  );

  protected readonly rangeStart = computed(() =>
    this.filteredBlogs().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  protected readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.filteredBlogs().length),
  );

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    // The admin screen paginates locally, so fetch a large enough page.
    this.blogService.getAdminAll(1, 100).subscribe({
      next: (result) => this.blogs.set(result.items),
      error: (error: unknown) => this.toast.error(apiErrorMessage(error)),
    });
  }

  protected search(): void {
    this.currentPage.set(1);
  }

  protected startCreate(): void {
    this.model = { ...EMPTY_MODEL };
    this.showForm.set(true);
  }

  /** No update endpoint exists; explain instead of opening a form that fails. */
  protected edit(_blog: Blog): void {
    this.toast.error('ویرایش مقاله در سرویس فعلی پشتیبانی نمی‌شود');
  }

  protected save(): void {
    if (!this.model.title?.trim() || !this.model.description?.trim() || !this.model.bodyText?.trim()) {
      this.toast.error('لطفا تمام فیلدها را پر کنید');
      return;
    }

    this.isSubmitting.set(true);

    this.blogService.create(this.model).subscribe({
      next: () => {
        this.toast.success('بلاگ جدید ثبت شد');
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

  /** No delete endpoint exists; explain instead of issuing a 405 request. */
  protected remove(_id?: number): void {
    this.toast.error('حذف مقاله در سرویس فعلی پشتیبانی نمی‌شود');
  }

  protected reset(): void {
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
}
