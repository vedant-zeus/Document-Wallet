import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid2x2 as Grid, List, Import as SortAsc, Dessert as SortDesc, Filter } from 'lucide-react';
import { Document } from '../../types';
import { DocumentCard } from './DocumentCard';
import { DocumentStats } from './DocumentStats';
import { Button } from '../UI/Button';

interface AllDocumentsViewProps {
  documents: Document[];
  onDelete: (document: Document) => Promise<void>;
  onDownload: (document: Document) => Promise<void>;
  searchQuery: string;
  selectedFilter: string;
}

type SortOption = 'name' | 'date' | 'size' | 'type';
type ViewMode = 'grid' | 'list';

export const AllDocumentsView = ({
  documents,
  onDelete,
  onDownload,
  searchQuery,
  selectedFilter,
}: AllDocumentsViewProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredAndSortedDocuments = useMemo(() => {
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

    // Sort documents
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename);
          break;
        case 'date':
          comparison = new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime();
          break;
        case 'size':
          comparison = a.file_size - b.file_size;
          break;
        case 'type':
          comparison = a.file_type.localeCompare(b.file_type);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [documents, searchQuery, selectedFilter, sortBy, sortOrder]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'Size' },
    { value: 'type', label: 'Type' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Statistics */}
      <DocumentStats documents={documents} />

      {/* Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">
              All Documents ({filteredAndSortedDocuments.length})
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handleSort(option.value as SortOption)}
                  className="flex items-center space-x-1"
                >
                  <span>{option.label}</span>
                  {sortBy === option.value && (
                    sortOrder === 'asc' ? 
                      <SortAsc className="w-3 h-3" /> : 
                      <SortDesc className="w-3 h-3" />
                  )}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Documents Display */}
      {filteredAndSortedDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <Filter className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {documents.length === 0 ? 'No documents uploaded yet' : 'No matching documents'}
          </h3>
          <p className="text-gray-300">
            {documents.length === 0 
              ? 'Upload your first document to get started with your digital wallet.'
              : 'Try adjusting your search terms or filters to find your documents.'
            }
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredAndSortedDocuments.map((document, index) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={onDelete}
              onDownload={onDownload}
              index={index}
              viewMode={viewMode}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};