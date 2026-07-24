import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, ArrowUpRight, HelpCircle } from 'lucide-react';

export const StatusCard = React.memo(({ status = 200 }) => {
  const getStatusConfig = (code) => {
    if (code >= 200 && code < 300) {
      return {
        label: `${code} OK`,
        category: 'Success',
        description: 'Target server responded with standard HTTP 200 OK status.',
        icon: CheckCircle,
        bgClass: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        glowClass: 'group-hover:border-emerald-500/50 group-hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)]'
      };
    }
    if (code >= 300 && code < 400) {
      return {
        label: `${code} Redirect`,
        category: 'Redirection',
        description: 'Target URL redirected to another canonical path or domain.',
        icon: ArrowUpRight,
        bgClass: 'bg-sky-950/30 border-sky-500/30 text-sky-300',
        badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        glowClass: 'group-hover:border-sky-500/50 group-hover:shadow-[0_8px_30px_rgb(56,189,248,0.15)]'
      };
    }
    if (code >= 400 && code < 500) {
      return {
        label: `${code} Client Error`,
        category: 'Client Error',
        description: 'Resource requested was not found or client request was forbidden.',
        icon: AlertTriangle,
        bgClass: 'bg-amber-950/30 border-amber-500/30 text-amber-300',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        glowClass: 'group-hover:border-amber-500/50 group-hover:shadow-[0_8px_30px_rgb(245,158,11,0.15)]'
      };
    }
    return {
      label: `${code} Server Error`,
      category: 'Server Error',
      description: 'Target origin server encountered an internal error processing request.',
      icon: XCircle,
      bgClass: 'bg-rose-950/30 border-rose-500/30 text-rose-300',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      glowClass: 'group-hover:border-rose-500/50 group-hover:shadow-[0_8px_30px_rgb(244,63,94,0.15)]'
    };
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={`glass-panel rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden group transition-all duration-300 border ${config.bgClass} ${config.glowClass}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-current">
            <IconComponent className="w-5 h-5" />
          </div>
          <span className="text-sm font-extrabold text-slate-300 tracking-wider uppercase">
            HTTP Status Code
          </span>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${config.badgeClass}`}>
          {config.label}
        </span>
      </div>

      {/* Main Value Display */}
      <div className="my-4">
        <div className="text-4xl font-black text-white tracking-tight font-mono">
          {status}
        </div>
      </div>

      {/* Footer / Description */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm text-slate-400 font-medium">
        <span className="truncate">{config.description}</span>
        <div className="relative group/tooltip cursor-help shrink-0 ml-1.5">
          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors" />
          <div className="absolute bottom-full right-0 mb-2.5 hidden group-hover/tooltip:block w-56 p-2.5 rounded-xl bg-[#141414] border border-white/20 text-xs text-slate-200 shadow-2xl z-20 pointer-events-none">
            {config.description}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

StatusCard.displayName = 'StatusCard';
