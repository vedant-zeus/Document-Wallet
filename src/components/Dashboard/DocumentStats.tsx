import { motion } from 'framer-motion';
import { FileText, HardDrive, Calendar, TrendingUp } from 'lucide-react';
import { Document } from '../../types';
import { DocumentService } from '../../services/documentService';

interface DocumentStatsProps {
  documents: Document[];
}

export const DocumentStats = ({ documents }: DocumentStatsProps) => {
  const totalSize = documents.reduce((sum, doc) => sum + doc.file_size, 0);
  const fileTypes = documents.reduce((acc, doc) => {
    acc[doc.file_type] = (acc[doc.file_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonType = Object.entries(fileTypes).sort(([,a], [,b]) => b - a)[0];
  const recentUploads = documents.filter(doc => {
    const uploadDate = new Date(doc.upload_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  const stats = [
    {
      icon: FileText,
      label: 'Total Documents',
      value: documents.length.toString(),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: DocumentService.formatFileSize(totalSize),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Calendar,
      label: 'Recent Uploads',
      value: `${recentUploads} this week`,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Most Common',
      value: mostCommonType ? mostCommonType[0].toUpperCase() : 'N/A',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          whileHover={{ y: -2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-300">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};