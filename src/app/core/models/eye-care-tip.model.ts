export interface EyeCareTip {
  id: number;
  title: string;
  description?: string | null;
  bodyText: string;
  imageUrl?: string | null;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}
