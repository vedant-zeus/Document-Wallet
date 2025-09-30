import { supabase } from './supabase';
import { Document, FileType } from '../types';

export class DocumentService {
  private static BUCKET_NAME = 'documents';
  private static ALLOWED_TYPES: FileType[] = ['pdf', 'docx', 'png', 'jpg', 'jpeg'];
  private static MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  static validateFile(file: File): string | null {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() as FileType;
    
    if (!this.ALLOWED_TYPES.includes(fileExtension)) {
      return 'File type not supported. Please upload PDF, DOCX, PNG, or JPG files.';
    }
    
    if (file.size > this.MAX_FILE_SIZE) {
      return 'File size too large. Maximum size is 10MB.';
    }
    
    return null;
  }

  static async uploadDocument(file: File): Promise<Document> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not authenticated');

    const validation = this.validateFile(file);
    if (validation) throw new Error(validation);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Save metadata to database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        filename: file.name,
        file_type: fileExtension || 'unknown',
        file_size: file.size,
        storage_path: filePath,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteDocument(document: Document): Promise<void> {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([document.storage_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document.id);

    if (dbError) throw dbError;
  }

  static async downloadDocument(document: Document): Promise<void> {
    try {
      // First, get a signed URL for the document
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(document.storage_path, 60); // 60 seconds expiry

      if (urlError) {
        // Fallback to direct download if signed URL fails
        const { data, error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .download(document.storage_path);

        if (error) throw error;

        // Create download link from blob
        const url = URL.createObjectURL(data);
        this.triggerDownload(url, document.filename);
        URL.revokeObjectURL(url);
      } else {
        // Use signed URL for download
        this.triggerDownload(signedUrlData.signedUrl, document.filename);
      }
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download document. Please try again.');
    }
  }

  private static triggerDownload(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank'; // Open in new tab as fallback
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  static getFileIcon(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'png':
      case 'jpg':
      case 'jpeg': return '🖼️';
      default: return '📎';
    }
  }
}