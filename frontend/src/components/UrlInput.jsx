import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';

export const UrlInput = React.memo(({ url, setUrl, onAnalyze, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative">
      <div className="glass-input rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 shadow-2xl relative z-10 transition-all duration-300">
        <div className="relative w-full flex items-center min-w-0">
          <div className="absolute left-3.5 sm:left-4 text-slate-400 pointer-events-none shrink-0">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          </div>
          <input
            id="url-audit-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full pl-11 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base lg:text-lg font-mono focus:outline-none truncate"
            disabled={loading}
            aria-label="Website URL to audit"
            autoComplete="url"
            autoFocus
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading || !url.trim()}
          whileHover={{ scale: loading || !url.trim() ? 1 : 1.02 }}
          whileTap={{ scale: loading || !url.trim() ? 1 : 0.98 }}
          className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 cursor-pointer shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Website</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
});

UrlInput.displayName = 'UrlInput';
