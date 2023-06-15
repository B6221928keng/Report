export interface FileUploadInterface {
  FileUploadID: number,
  name: string;
  size: number;
  type: string;
  CreatedAt: Date | null,
  UpdatedAt: Date | null,
  content: File | null | string | Blob ;
}

export interface FileUpInterface {
  ID: number,
  Name: string;
  Size: number;
  Type: string;
  content: File | null | string | Blob ;
}

