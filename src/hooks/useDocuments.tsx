import { useState, useEffect } from 'react';
import { Document, DocumentState } from '../types';
import { DocumentService } from '../services/documentService';
import { useAuth } from './useAuth';

export const useDocuments = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DocumentState>({
    documents: [],
    loading: false,
    error: null,
    uploading: false,
  });

  const fetchDocuments = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const documents = await DocumentService.getDocuments();
      setState(prev => ({ ...prev, documents, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load documents' 
      }));
    }
  };

  const uploadDocument = async (file: File) => {
    setState(prev => ({ ...prev, uploading: true, error: null }));
    try {
      const document = await DocumentService.uploadDocument(file);
      setState(prev => ({ 
        ...prev, 
        documents: [document, ...prev.documents], 
        uploading: false 
      }));
      return document;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }));
      throw error;
    }
  };

  const deleteDocument = async (document: Document) => {
    try {
      await DocumentService.deleteDocument(document);
      setState(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.id !== document.id),
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      }));
      throw error;
    }
  };

  const downloadDocument = async (document: Document) => {
    setState(prev => ({ ...prev, error: null }));
    try {
      await DocumentService.downloadDocument(document);
      // Show success feedback
      setState(prev => ({ 
        ...prev, 
        error: null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Download failed' 
      }));
      throw error;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  return {
    ...state,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    refetch: fetchDocuments,
  };
};