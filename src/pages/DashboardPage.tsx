import { useState } from 'react';
import { motion } from 'framer-motion';
import { WalletHeader } from '../components/Dashboard/WalletHeader';
import { NavigationTabs } from '../components/Dashboard/NavigationTabs';
import { SearchBar } from '../components/Dashboard/SearchBar';
import { UploadArea } from '../components/Dashboard/UploadArea';
import { DocumentGrid } from '../components/Dashboard/DocumentGrid';
import { AllDocumentsView } from '../components/Dashboard/AllDocumentsView';
import { useDocuments } from '../hooks/useDocuments';

export const DashboardPage = () => {
  const { documents, loading, error, deleteDocument, downloadDocument } = useDocuments();
  const [activeTab, setActiveTab] = useState<'overview' | 'all-documents' | 'upload'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Auto-switch to all-documents tab when there are many documents
  const handleUploadSuccess = () => {
    if (documents.length > 8 && activeTab === 'upload') {
      setActiveTab('all-documents');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <WalletHeader />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Wallet Opening Animation */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <NavigationTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {(activeTab === 'overview' || activeTab === 'all-documents') && (
            <SearchBar 
              onSearch={setSearchQuery}
              onFilterChange={setSelectedFilter}
            />
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200"
            >
              {error}
            </motion.div>
          )}

          {loading && activeTab !== 'upload' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-16"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-white">Loading your documents...</span>
              </div>
            </motion.div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <>
                  <UploadArea onUploadSuccess={handleUploadSuccess} />
                  <DocumentGrid
                    documents={documents.slice(0, 8)} // Show recent 8 documents
                    onDelete={deleteDocument}
                    onDownload={downloadDocument}
                    searchQuery={searchQuery}
                    selectedFilter={selectedFilter}
                  />
                  {documents.length > 8 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <button
                        onClick={() => setActiveTab('all-documents')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      >
                        View All {documents.length} Documents
                      </button>
                    </motion.div>
                  )}
                </>
              )}

              {activeTab === 'all-documents' && (
                <AllDocumentsView
                  documents={documents}
                  onDelete={deleteDocument}
                  onDownload={downloadDocument}
                  searchQuery={searchQuery}
                  selectedFilter={selectedFilter}
                />
              )}

              {activeTab === 'upload' && <UploadArea onUploadSuccess={handleUploadSuccess} />}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};