export interface ServiceDto {
  id: number;
  title: string;
  description: string;
  /** Present on admin responses only. */
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}
