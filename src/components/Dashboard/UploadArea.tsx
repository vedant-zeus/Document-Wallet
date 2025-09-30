import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentService } from '../../services/documentService';

interface UploadStatus {
  file: File;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadAreaProps {
  onUploadSuccess?: () => void;
}

export const UploadArea = ({ onUploadSuccess }: UploadAreaProps) => {
  const { uploadDocument } = useDocuments();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const newStatuses: UploadStatus[] = fileArray.map(file => ({
      file,
      status: 'uploading' as const,
    }));

    setUploadStatuses(prev => [...prev, ...newStatuses]);

    let successCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const validation = DocumentService.validateFile(file);
      
      if (validation) {
        setUploadStatuses(prev => prev.map(status => 
          status.file === file 
            ? { ...status, status: 'error' as const, error: validation }
            : status
        ));
        continue;
      }

      try {
        await uploadDocument(file);
        setUploadStatuses(prev => prev.map(status => 
          status.file === file 
            ? { ...status, status: 'success' as const }
            : status
        ));
        successCount++;
      } catch (error) {
        setUploadStatuses(prev => prev.map(status => 
          status.file === file 
            ? { 
                ...status, 
                status: 'error' as const, 
                error: error instanceof Error ? error.message : 'Upload failed' 
              }
            : status
        ));
      }
    }

    // Call success callback if any files were uploaded successfully
    if (successCount > 0 && onUploadSuccess) {
      onUploadSuccess();
    }

    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploadStatuses(prev => prev.filter(status => 
        status.status === 'uploading' || 
        (status.status === 'error' && Date.now() - prev.findIndex(s => s === status) * 100 < 5000)
      ));
    }, 3000);
  }, [uploadDocument, onUploadSuccess]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeUploadStatus = (file: File) => {
    setUploadStatuses(prev => prev.filter(status => status.file !== file));
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-white/30 bg-white/5 hover:bg-white/10'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.png,.jpg,.jpeg"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <motion.div
            animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <Upload className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragOver ? 'Drop files here' : 'Upload Documents'}
          </h3>
          <p className="text-gray-300 mb-4">
            Drag and drop files or click to browse
          </p>
          <p className="text-sm text-gray-400">
            Supports PDF, DOCX, PNG, JPG (Max 10MB)
          </p>
        </div>
      </div>

      {/* Upload Status List */}
      <AnimatePresence>
        {uploadStatuses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {uploadStatuses.map((status, index) => (
              <motion.div
                key={`${status.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">{status.file.name}</p>
                    <p className="text-sm text-gray-300">
                      {DocumentService.formatFileSize(status.file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {status.status === 'uploading' && (
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {status.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {status.status === 'error' && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">{status.error}</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeUploadStatus(status.file)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};