import { motion } from 'framer-motion';
import { Home, FolderOpen, Upload } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: 'overview' | 'all-documents' | 'upload';
  onTabChange: (tab: 'overview' | 'all-documents' | 'upload') => void;
}

export const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  const tabs = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: Home,
      description: 'Quick access and recent uploads'
    },
    {
      id: 'all-documents' as const,
      label: 'All Documents',
      icon: FolderOpen,
      description: 'Browse and manage all files'
    },
    {
      id: 'upload' as const,
      label: 'Upload',
      icon: Upload,
      description: 'Add new documents'
    },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 mb-8"
    >
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300
              ${activeTab === tab.id 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
              }
            `}
            whileHover={{ scale: activeTab === tab.id ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">{tab.label}</div>
              <div className="text-xs opacity-75 hidden sm:block">{tab.description}</div>
            </div>
            
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl -z-10"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};