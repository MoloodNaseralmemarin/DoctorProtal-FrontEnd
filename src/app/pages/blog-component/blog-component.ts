import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Blog } from '../../../models/blog.model';
import { BlogService } from '../../services/blog-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-component',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './blog-component.html',
  styleUrl: './blog-component.css',
})
export class BlogComponent implements OnInit {
    blogs: Blog[] = [];

  model: Partial<Blog> = {
    title: '',
    description: '',
    isActive: true,
  };

  editingId: number | null = null;

  // ✅ Angular 20 style injection
  private readonly service = inject(BlogService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        // The API may answer with a plain array or with a paged payload.
        const items: Blog[] = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
        this.blogs = [...items];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Load error:', err),
    });
  }
}