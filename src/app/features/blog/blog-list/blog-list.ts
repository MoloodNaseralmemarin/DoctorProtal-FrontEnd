import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Blog } from '../../../core/models/blog.model';
import { BlogService } from '../../../core/services/blog.service';

type ListState = 'loading' | 'ready' | 'empty' | 'error';

/** Public "latest articles" section on the home page. */
@Component({
  selector: 'app-blog-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.css',
})
export class BlogListComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly blogs = signal<readonly Blog[]>([]);
  protected readonly status = signal<ListState>('loading');

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.status.set('loading');

    this.blogService
      .getAll(1, 9)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.blogs.set(result.items);
          this.status.set(result.items.length ? 'ready' : 'empty');
        },
        error: () => {
          this.blogs.set([]);
          this.status.set('error');
        },
      });
  }
}
