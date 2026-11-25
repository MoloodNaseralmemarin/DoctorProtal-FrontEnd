import { Component, inject, OnInit } from '@angular/core';
import { GalleryImage } from '../../../models/gallery.model';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../services/gallery-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gallery-component',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.css',
})
export class GalleryComponent implements OnInit {


  images: GalleryImage[] = [];
  totalCount = 0;

  currentPage = 1;
  pageSize = 6;

  isLoading = true;

  selectedImage: GalleryImage | null = null;
  private readonly galleryService = inject(GalleryService);
  galleryImagePath = environment.galleryImagePath;

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.isLoading = true;

    this.galleryService
      .getGallery(this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.images = res?.items ?? [];
          this.totalCount = res?.totalCount ?? 0;
          this.isLoading = false;
        },
        error: () => {
          this.images = [];
          this.totalCount = 0;
          this.isLoading = false;
        },
      });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadImages();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  openModal(image: GalleryImage) {
    this.selectedImage = image;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    this.selectedImage = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }

  nextImage() {
    if (!this.selectedImage) return;
    const currentIndex = this.images.findIndex(img => img.id === this.selectedImage?.id);
    if (currentIndex < this.images.length - 1) {
      this.selectedImage = this.images[currentIndex + 1];
    } else {
      this.selectedImage = this.images[0];
    }
  }

  prevImage() {
    if (!this.selectedImage) return;
    const currentIndex = this.images.findIndex(img => img.id === this.selectedImage?.id);
    if (currentIndex > 0) {
      this.selectedImage = this.images[currentIndex - 1];
    } else {
      this.selectedImage = this.images[this.images.length - 1];
    }
  }

}
