export interface Blog {
  id?: number;
  title: string;
  description: string;
  bodyText?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}