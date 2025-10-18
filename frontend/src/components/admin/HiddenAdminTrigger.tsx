import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

const HiddenAdminTrigger: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showTrigger, setShowTrigger] = useState(false);

  // Track clicks in the top-right corner
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Check if click is in top-right corner (within 100px of top-right)
      if (x > rect.width - 100 && y < 100) {
        setClickCount(prev => prev + 1);
        
        // Reset click count after 2 seconds
        setTimeout(() => setClickCount(0), 2000);
        
        // Open modal after 3 clicks
        if (clickCount >= 2) {
          setIsModalOpen(true);
          setClickCount(0);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [clickCount]);

  // Show trigger on hover over top-right area
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Show trigger when hovering in top-right corner
      if (x > rect.width - 80 && y < 80) {
        setShowTrigger(true);
      } else {
        setShowTrigger(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Hidden trigger indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showTrigger ? 0.3 : 0,
          scale: showTrigger ? 1 : 0.8
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-4 right-4 z-40 pointer-events-none"
      >
        <div className="w-8 h-8 bg-edicius-gold/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-edicius-gold/30">
          <Settings className="w-4 h-4 text-edicius-gold" />
        </div>
      </motion.div>

      {/* Click counter indicator */}
      {clickCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 right-4 z-40"
        >
          <div className="bg-edicius-navy text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {clickCount}/3 clicks
          </div>
        </motion.div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default HiddenAdminTrigger;
