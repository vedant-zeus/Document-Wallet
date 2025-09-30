export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  upload_date: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
}

export type FileType = 'pdf' | 'docx' | 'png' | 'jpg' | 'jpeg';

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}