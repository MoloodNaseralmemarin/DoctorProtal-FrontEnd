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
 * Create, edit and delete blog articles. The list is fetched in one page and
 * searched/paginated locally because the API exposes no title filter.
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
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly isEditLoading = signal(false);
  protected readonly deletingId = signal<number | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(5);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<number | null>(null);

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
    this.isLoading.set(true);

    this.blogService.getAdminAll(1, 100).subscribe({
      next: (result) => {
        this.blogs.set(result.items);
        this.isLoading.set(false);

        // A delete can empty the page the operator was looking at.
        this.currentPage.update((page) =>
          Math.min(Math.max(1, page), Math.max(1, Math.ceil(this.filteredBlogs().length / this.pageSize()))),
        );
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.toast.error(apiErrorMessage(error));
      },
    });
  }

  protected search(): void {
    this.currentPage.set(1);
  }

  protected startCreate(): void {
    this.editingId.set(null);
    this.model = { ...EMPTY_MODEL };
    this.showForm.set(true);
  }

  /** Loads the full record first: the list endpoint omits `bodyText`. */
  protected edit(blog: Blog): void {
    if (this.isEditLoading()) {
      return;
    }

    if (blog.id === undefined) {
      this.toast.error('شناسه مقاله یافت نشد');
      return;
    }

    this.isEditLoading.set(true);

    this.blogService.getAdminById(blog.id).subscribe({
      next: (full) => {
        this.editingId.set(full.id ?? blog.id!);
        this.model = {
          title: full.title ?? blog.title,
          description: full.description ?? blog.description,
          bodyText: full.bodyText ?? '',
          isActive: full.isActive ?? true,
        };
        this.showForm.set(true);
        this.isEditLoading.set(false);
      },
      error: (error: unknown) => {
        this.isEditLoading.set(false);
        this.toast.error(apiErrorMessage(error));
      },
    });
  }

  protected save(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (!this.model.title?.trim() || !this.model.description?.trim() || !this.model.bodyText?.trim()) {
      this.toast.error('لطفا عنوان، خلاصه و متن مقاله را پر کنید');
      return;
    }

    this.isSubmitting.set(true);

    const id = this.editingId();
    const request$ = id
      ? this.blogService.update(id, this.model)
      : this.blogService.create(this.model);

    request$.subscribe({
      next: () => {
        this.toast.success(id ? 'مقاله با موفقیت ویرایش شد' : 'بلاگ جدید ثبت شد');
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

  protected remove(blog: Blog): void {
    if (this.deletingId() !== null) {
      return;
    }

    if (!confirm(`آیا از حذف مقاله «${blog.title}» اطمینان دارید؟`)) {
      return;
    }

    if (blog.id === undefined) {
      this.toast.error('شناسه مقاله یافت نشد');
      return;
    }

    this.deletingId.set(blog.id);

    this.blogService.delete(blog.id).subscribe({
      next: () => {
        this.toast.success('مقاله با موفقیت حذف شد');
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
