import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import { Button } from '../UI/Button';
import { useAuth } from '../../hooks/useAuth';

export const WalletHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
            >
              <span className="text-xl">🗂️</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">Document Wallet</h1>
              <p className="text-gray-300 text-sm">Secure document storage</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};