import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const MetaDescriptionCard = React.memo(({ description }) => {
  const [expanded, setExpanded] = useState(false);

  const hasDescription = Boolean(description && description.trim());
  const isLong = hasDescription && description.length > 120;

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="glass-panel-interactive rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden group border border-white/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-white/[0.06] text-purple-400 border border-white/10 group-hover:text-purple-300 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-sm font-extrabold text-slate-300 tracking-wider uppercase">
            Meta Description
          </span>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
          hasDescription
            ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
            : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
        }`}>
          {hasDescription ? 'Present' : 'Missing'}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="my-4 flex-1">
        {hasDescription ? (
          <div>
            <AnimatePresence initial={false}>
              <motion.p
                key={expanded ? 'expanded' : 'collapsed'}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.15 }}
                className={`text-base sm:text-lg text-slate-200 leading-relaxed font-medium ${
                  !expanded && isLong ? 'line-clamp-2' : ''
                }`}
              >
                "{description}"
              </motion.p>
            </AnimatePresence>

            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-2.5 text-sm font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors focus:outline-none focus:underline cursor-pointer"
                aria-expanded={expanded}
              >
                <span>{expanded ? 'Show Less' : 'Read More'}</span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        ) : (
          <span className="text-slate-500 italic text-base">
            Meta description tag is missing. Search engines will fallback to page text.
          </span>
        )}
      </div>

      {/* Footer / Subtitle */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm text-slate-400 font-medium">
        <span className="truncate">
          {hasDescription ? `${description.length} characters` : '0 characters'}
        </span>
        <div className="relative group/tooltip cursor-help shrink-0 ml-1.5">
          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors" />
          <div className="absolute bottom-full right-0 mb-2.5 hidden group-hover/tooltip:block w-60 p-2.5 rounded-xl bg-[#141414] border border-white/20 text-xs text-slate-200 shadow-2xl z-20 pointer-events-none">
            Meta description summary used by Google & search engines for snippet previews. Recommended length: 120-160 characters.
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MetaDescriptionCard.displayName = 'MetaDescriptionCard';
