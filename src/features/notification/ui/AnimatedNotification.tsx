"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface AnimatedNotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

export const AnimatedNotificationComponent = ({ 
  type, 
  message, 
  onClose, 
  isVisible 
}: AnimatedNotificationProps) => {
  const icon = type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />;
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            x: 300, 
            scale: 0.8 
          }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            scale: 1 
          }}
          exit={{ 
            opacity: 0, 
            x: 300, 
            scale: 0.8 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl border ${bgColor} ${borderColor} text-white min-w-[300px]`}
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            {icon}
            <span className="flex-1 font-medium">{message}</span>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
          
          {/* Прогресс-бар */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className="h-1 bg-white/30 rounded-full mt-3"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
