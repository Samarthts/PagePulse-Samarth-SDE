import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export const MetricCard = React.memo(({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'neutral',
  tooltip,
  highlight = false
}) => {
  const badgeStyles = {
    success: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
    danger: 'bg-rose-950/90 text-rose-300 border-rose-500/40',
    info: 'bg-indigo-950/90 text-indigo-300 border-indigo-500/40',
    neutral: 'bg-white/[0.08] text-slate-200 border-white/10'
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={`glass-panel-interactive rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden group ${
        highlight ? 'border-indigo-500/50 bg-indigo-950/30' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-white/[0.06] text-indigo-400 border border-white/10 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-colors">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <span className="text-sm font-extrabold text-slate-300 tracking-wider uppercase">
            {title}
          </span>
        </div>

        {badge && (
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${badgeStyles[badgeType] || badgeStyles.neutral}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Main Value Display */}
      <div className="my-4">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words line-clamp-3">
          {value !== undefined && value !== null && value !== '' ? (
            value
          ) : (
            <span className="text-slate-500 italic text-base">Not Provided</span>
          )}
        </div>
      </div>

      {/* Subtitle / Footer info */}
      {(subtitle || tooltip) && (
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm text-slate-400 font-medium">
          <span className="truncate">{subtitle}</span>
          {tooltip && (
            <div className="relative group/tooltip cursor-help shrink-0 ml-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors" />
              <div className="absolute bottom-full right-0 mb-2.5 hidden group-hover/tooltip:block w-56 p-2.5 rounded-xl bg-[#141414] border border-white/20 text-xs text-slate-200 shadow-2xl z-20 pointer-events-none">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';
