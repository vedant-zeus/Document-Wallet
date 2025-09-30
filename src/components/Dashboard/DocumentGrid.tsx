import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2 } from 'lucide-react';
import { Document } from '../../types';
import { DocumentCard } from './DocumentCard';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

interface DocumentGridProps {
  documents: Document[];
  onDelete: (document: Document) => Promise<void>;
  onDownload: (document: Document) => Promise<void>;
  searchQuery: string;
  selectedFilter: string;
}

export const DocumentGrid = ({
  documents,
  onDelete,
  onDownload,
  searchQuery,
  selectedFilter,
}: DocumentGridProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [deletingDocument, setDeletingDocument] = useState(false);

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by file type
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'image') {
        filtered = filtered.filter(doc =>
          ['png', 'jpg', 'jpeg'].includes(doc.file_type.toLowerCase())
        );
      } else {
        filtered = filtered.filter(doc =>
          doc.file_type.toLowerCase() === selectedFilter
        );
      }
    }

    return filtered;
  }, [documents, searchQuery, selectedFilter]);

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setDeletingDocument(true);
    try {
      await onDelete(documentToDelete);
      setDeleteModalOpen(false);
      setDocumentToDelete(null);
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setDeletingDocument(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center"
        >
          <FileText className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-white mb-4">No documents yet</h3>
        <p className="text-gray-300 max-w-md mx-auto">
          Start by uploading your first document. You can drag and drop files or click the upload area above.
        </p>
      </motion.div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <h3 className="text-xl font-semibold text-white mb-2">No matching documents</h3>
        <p className="text-gray-300">
          Try adjusting your search terms or filters.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {filteredDocuments.map((document, index) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDeleteClick}
              onDownload={onDownload}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete Document"
        maxWidth="max-w-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete "{documentToDelete?.filename}"?
          </h3>
          
          <p className="text-gray-600 mb-6">
            This action cannot be undone. The document will be permanently deleted from your wallet.
          </p>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={handleDeleteCancel}
              className="flex-1"
              disabled={deletingDocument}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={deletingDocument}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};