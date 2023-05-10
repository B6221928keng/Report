export interface FileUploadInterface {
  ID: number,
  name: string;
  size: number;
  type: string;
  content: File | null | string | Blob ;
}
