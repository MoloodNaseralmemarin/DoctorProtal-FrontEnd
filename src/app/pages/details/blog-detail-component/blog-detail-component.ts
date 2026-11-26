import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Blog } from '../../../../models/blog.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog-service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ArticleState = 'loading' | 'ready' | 'error' | 'notfound';

@Component({
  selector: 'app-blog-detail-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail-component.html',
  styleUrl: './blog-detail-component.css',
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
      .getById(id)
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
