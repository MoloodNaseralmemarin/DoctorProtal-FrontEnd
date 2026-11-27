import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Blog } from '../../../core/models/blog.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RichTextPipe } from '../../../shared/pipes/rich-text.pipe';

type ArticleState = 'loading' | 'ready' | 'error' | 'notfound';

@Component({
  selector: 'app-blog-detail-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, RichTextPipe],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetailComponent implements OnInit {

  readonly blog = signal<Blog | null>(null);
  readonly status = signal<ArticleState>('loading');

  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(BlogService);
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
      .getPublicById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blog) => {
          if (!blog) {
            this.status.set('notfound');
            return;
          }

          this.blog.set(blog);
          this.status.set('ready');
        },
        error: () => {
          this.blog.set(null);
          this.status.set('error');
        },
      });
  }
}
