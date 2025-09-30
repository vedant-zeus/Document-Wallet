import { motion } from 'framer-motion';
import { Download, Trash2, Calendar, HardDrive, FileText, CheckCircle } from 'lucide-react';
import { Document } from '../../types';
import { DocumentService } from '../../services/documentService';
import { useState } from 'react';

interface DocumentCardProps {
  document: Document;
  onDelete: (document: Document) => void;
  onDownload: (document: Document) => void;
  index: number;
  viewMode?: 'grid' | 'list';
}

export const DocumentCard = ({ 
  document, 
  onDelete, 
  onDownload, 
  index,
  viewMode = 'grid'
}: DocumentCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'from-red-500 to-red-600';
      case 'docx': return 'from-blue-500 to-blue-600';
      case 'png':
      case 'jpg':
      case 'jpeg': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      await onDownload(document);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsDownloading(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        whileHover={{ x: 5 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 bg-gradient-to-br ${getFileTypeColor(document.file_type)} rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0`}
            >
              {DocumentService.getFileIcon(document.file_type)}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate" title={document.filename}>
                {document.filename}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="uppercase tracking-wider">{document.file_type}</span>
                <span>{DocumentService.formatFileSize(document.file_size)}</span>
                <span>{formatDate(document.upload_date)}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              disabled={isDownloading}
              className={`p-2 rounded-lg transition-colors ${
                downloadSuccess 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300'
              } disabled:opacity-50`}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : downloadSuccess ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(document)}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 group"
    >
      {/* File Icon */}
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-12 h-12 bg-gradient-to-br ${getFileTypeColor(document.file_type)} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
        >
          {DocumentService.getFileIcon(document.file_type)}
        </motion.div>

        {/* Actions */}
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className={`p-2 rounded-lg transition-colors ${
              downloadSuccess 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300'
            } disabled:opacity-50`}
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : downloadSuccess ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(document)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* File Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-white truncate" title={document.filename}>
            {document.filename}
          </h3>
          <p className="text-sm text-gray-300 uppercase tracking-wider">
            {document.file_type}
          </p>
        </div>

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-400">
            <HardDrive className="w-4 h-4 mr-2" />
            {DocumentService.formatFileSize(document.file_size)}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(document.upload_date)}
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};