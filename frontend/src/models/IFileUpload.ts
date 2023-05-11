export interface FileUploadInterface {
  ID: number,
  name: string;
  size: number;
  type: string;
  CreatedAt: Date | null,
  UpdatedAt: Date | null,
  content: File | null | string | Blob ;
}
