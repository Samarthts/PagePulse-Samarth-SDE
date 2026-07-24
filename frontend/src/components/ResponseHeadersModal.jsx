import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Server, Copy, Check } from 'lucide-react';

export const ResponseHeadersModal = React.memo(({ isOpen, onClose, headers, targetUrl }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !headers) return null;

  const headerPairs = Object.entries(headers);

  const handleCopyHeaders = () => {
    navigator.clipboard.writeText(JSON.stringify(headers, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-indigo-400" />
              <h3 id="modal-title" className="font-bold text-white text-lg tracking-tight">
                HTTP Response Headers
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Close headers modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-slate-400 mb-4">
              <span className="text-indigo-400 font-bold">Target URL:</span> {targetUrl}
            </div>

            {headerPairs.length === 0 ? (
              <p className="text-slate-500 italic py-4 text-center">No HTTP response headers captured for this target.</p>
            ) : (
              <div className="space-y-2">
                {headerPairs.map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-white/[0.06] transition-colors">
                    <span className="text-purple-300 font-semibold uppercase tracking-wider">{key}</span>
                    <span className="text-emerald-300 break-all">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
            <span className="text-xs text-slate-400">{headerPairs.length} headers captured</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyHeaders}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Headers'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

ResponseHeadersModal.displayName = 'ResponseHeadersModal';
