import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UrlInput } from './UrlInput';
import { Sparkles, Clock, Zap } from 'lucide-react';

export const HeroSection = React.memo(({
  url,
  setUrl,
  onAnalyze,
  loading,
  recentSearches,
  formatUrlInput,
  hasReport = false
}) => {
  const handleQuickUrl = (quickUrl) => {
    setUrl(quickUrl);
    onAnalyze(quickUrl);
  };

  return (
    <div className={`relative px-4 sm:px-6 lg:px-8 max-w-[1340px] mx-auto text-center transition-all duration-300 ${
      hasReport ? 'pt-4 pb-2 sm:pt-6 sm:pb-4' : 'pt-8 pb-8 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-14'
    }`}>
      {/* Floating Animated Background Blobs */}
      <div className="glow-blob-purple" />
      <div className="glow-blob-blue" />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!hasReport && (
            <motion.div
              key="hero-heading"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* SaaS Enterprise Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-indigo-300 text-xs sm:text-sm font-bold tracking-wide mb-5 shadow-inner backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Next-Gen Web Auditor & Performance Engine</span>
              </div>

              {/* Large Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Analyze Any Website in{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Seconds
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                Instant production-grade analysis of response speed, HTML architecture, H1 hierarchy, missing image alt tags, metadata quality, and security headers.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* URL Input CTA Form */}
        <div className={hasReport ? 'mt-0' : 'mt-6 sm:mt-8'}>
          <UrlInput
            url={url}
            setUrl={setUrl}
            onAnalyze={onAnalyze}
            loading={loading}
          />
        </div>

        {/* Preset Quick URL Buttons - Render only when no report or in compact form */}
        {!hasReport && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-200">
            <span className="font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Quick test:
            </span>
            {[
              { label: 'Example.com', url: 'https://example.com' },
              { label: 'GitHub.com', url: 'https://github.com' },
              { label: 'Wikipedia.org', url: 'https://wikipedia.org' },
            ].map((preset) => (
              <motion.button
                key={preset.url}
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleQuickUrl(preset.url)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 text-white font-extrabold text-xs sm:text-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer shadow-sm"
              >
                {preset.label}
              </motion.button>
            ))}
          </div>
        )}

        {/* Recent Audits Quick History */}
        {!hasReport && recentSearches && recentSearches.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/[0.08] max-w-xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 font-bold">Recent:</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {recentSearches.slice(0, 3).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickUrl(item.url)}
                  className="hover:underline text-slate-200 font-mono font-medium truncate max-w-[150px] focus:outline-none focus:text-indigo-300 cursor-pointer"
                  title={item.url}
                >
                  {item.url.replace(/^https?:\/\//, '')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';
