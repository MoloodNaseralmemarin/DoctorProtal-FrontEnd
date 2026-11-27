import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryImage } from '../../core/models/gallery.model';
import { GalleryService } from '../../core/services/gallery.service';
import { environment } from '../../../environments/environment';
import { PaginationComponent } from '../../shared/ui/pagination/pagination';
import { lockBodyScroll, unlockBodyScroll } from '../../core/ui/body-scroll-lock';

type GalleryState = 'loading' | 'ready' | 'empty' | 'error';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class GalleryComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);

  protected readonly galleryImagePath = environment.galleryImagePath;

  protected readonly images = signal<readonly GalleryImage[]>([]);
  protected readonly status = signal<GalleryState>('loading');
  protected readonly currentPage = signal(1);
  protected readonly totalCount = signal(0);
  protected readonly selectedImage = signal<GalleryImage | null>(null);

  protected readonly totalPages = computed(() =>
    Math.ceil(this.totalCount() / PAGE_SIZE),
  );

  ngOnInit(): void {
    this.loadImages();
  }

  protected loadImages(): void {
    this.status.set('loading');

    this.galleryService.getGallery(this.currentPage(), PAGE_SIZE).subscribe({
      next: (result) => {
        this.images.set(result.items);
        this.totalCount.set(result.totalCount);
        this.status.set(result.items.length ? 'ready' : 'empty');
      },
      error: () => {
        this.images.set([]);
        this.totalCount.set(0);
        this.status.set('error');
      },
    });
  }

  protected changePage(page: number): void {
    this.currentPage.set(page);
    this.loadImages();
  }

  protected openModal(image: GalleryImage): void {
    this.selectedImage.set(image);
    lockBodyScroll();
  }

  protected closeModal(): void {
    if (!this.selectedImage()) {
      return;
    }

    this.selectedImage.set(null);
    unlockBodyScroll();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeModal();
  }

  protected nextImage(): void {
    this.step(1);
  }

  protected prevImage(): void {
    this.step(-1);
  }

  /** Cycles through the current page of images. */
  private step(delta: number): void {
    const images = this.images();
    const current = this.selectedImage();

    if (!current || images.length === 0) {
      return;
    }

    const index = images.findIndex((image) => image.id === current.id);
    const nextIndex = (index + delta + images.length) % images.length;

    this.selectedImage.set(images[nextIndex]);
  }
}
