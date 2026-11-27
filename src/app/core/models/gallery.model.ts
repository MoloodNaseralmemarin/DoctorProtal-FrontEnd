export interface GalleryImage {
  id: number;
  title: string;
  imageUrl: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}