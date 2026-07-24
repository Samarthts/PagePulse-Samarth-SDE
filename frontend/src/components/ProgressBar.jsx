import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = React.memo(({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900 overflow-hidden">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'easeInOut'
        }}
        className="h-full w-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
      />
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
