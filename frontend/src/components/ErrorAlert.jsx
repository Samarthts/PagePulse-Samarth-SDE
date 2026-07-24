import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, XCircle, WifiOff, ShieldAlert, FileCode } from 'lucide-react';

export const ErrorAlert = React.memo(({ error, onRetry }) => {
  if (!error) return null;

  const getErrorDetails = () => {
    const code = error.statusCode || 500;
    const msg = error.message || 'Audit Failed';
    const detail = error.detail || 'An unexpected error occurred while performing website analysis.';

    if (code === 400 || msg.includes('Invalid URL') || msg.includes('Empty URL')) {
      return {
        icon: XCircle,
        title: 'Invalid URL Format',
        badge: 'HTTP 400',
        colorClass: 'border-rose-500/40 bg-rose-950/40 text-rose-100',
        iconClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        tip: 'Ensure the URL includes valid domain format (e.g. https://example.com or http://localhost:8000).'
      };
    }
    if (code === 504 || msg.includes('timed out') || msg.includes('ECONNABORTED')) {
      return {
        icon: WifiOff,
        title: 'Gateway Timeout (504)',
        badge: 'HTTP 504',
        colorClass: 'border-amber-500/40 bg-amber-950/40 text-amber-100',
        iconClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        tip: 'Target server took longer than 15 seconds to respond. The site might be offline or rate-limiting scrapers.'
      };
    }
    if (code === 415 || msg.includes('non-HTML')) {
      return {
        icon: FileCode,
        title: 'Non-HTML Resource (415)',
        badge: 'HTTP 415',
        colorClass: 'border-purple-500/40 bg-purple-950/40 text-purple-100',
        iconClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        tip: 'Target URL returned a binary file, JSON, image, or PDF. Page Pulse can only audit HTML web pages.'
      };
    }
    if (msg.includes('SSL') || msg.includes('certificate')) {
      return {
        icon: ShieldAlert,
        title: 'SSL / TLS Security Error',
        badge: 'SSL Failure',
        colorClass: 'border-rose-500/40 bg-rose-950/40 text-rose-100',
        iconClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        tip: 'Target website has invalid or expired SSL certificates preventing secure HTTP handshake.'
      };
    }
    return {
      icon: AlertTriangle,
      title: 'Connection / Backend Failure',
      badge: `HTTP ${code}`,
      colorClass: 'border-rose-500/40 bg-rose-950/40 text-rose-100',
      iconClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      tip: 'Verify internet connectivity, check target URL host resolution, or verify backend API state.'
    };
  };

  const info = getErrorDetails();
  const IconComponent = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl mx-auto my-8 px-4"
      role="alert"
      aria-live="assertive"
    >
      <div className={`glass-panel rounded-3xl p-7 sm:p-8 border-2 ${info.colorClass} shadow-2xl relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-start gap-4.5">
          <div className={`p-4 rounded-2xl border shrink-0 ${info.iconClass}`}>
            <IconComponent className="w-7 h-7" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">{info.title}</h4>
              <span className="px-3 py-1 rounded-full text-sm font-mono font-black bg-black/60 text-white border border-white/10">
                {info.badge}
              </span>
            </div>

            <p className="mt-2.5 text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
              {error.detail || error.message}
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-white/10 text-sm sm:text-base text-slate-300 leading-relaxed">
              <strong className="text-white font-extrabold">Diagnostic Tip:</strong> {info.tip}
            </div>

            {onRetry && (
              <div className="mt-5 flex items-center justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={onRetry}
                  className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-sm sm:text-base font-extrabold flex items-center gap-2.5 transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                >
                  <RefreshCw className="w-4.5 h-4.5" />
                  <span>Try Again</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ErrorAlert.displayName = 'ErrorAlert';
