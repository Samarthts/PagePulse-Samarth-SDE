import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Shield, Globe, Cpu, BarChart3 } from 'lucide-react';

export const LoadingSkeleton = React.memo(({ step = 1 }) => {
  const steps = [
    { title: 'DNS Resolution & Security Handshake', desc: 'Establishing encrypted HTTPS connection', icon: Shield },
    { title: 'Fetching HTML Payload & Headers', desc: 'Measuring network latency and server response', icon: Globe },
    { title: 'DOM & Meta Structure Extraction', desc: 'Parsing title, H1 hierarchy, alt tags, and word count', icon: Cpu },
    { title: 'SEO Score Computation', desc: 'Synthesizing health indicators and generating report', icon: BarChart3 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto my-8 px-4"
    >
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        {/* Animated Top Shimmer Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
          <div className="w-full h-full bg-white/30 animate-shimmer"></div>
        </div>

        <div className="flex flex-col items-center text-center mb-8 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Auditing Target Website</h3>
          <p className="text-sm text-slate-400 mt-1">Please wait while Page Pulse inspects server headers, HTML structure, and performance metrics</p>
        </div>

        {/* Step Progress Indicators */}
        <div className="space-y-3.5 max-w-xl mx-auto mb-10">
          {steps.map((s, index) => {
            const stepNum = index + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-950/60 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                    : isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                    : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs text-slate-500 font-mono">
                      {stepNum}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-semibold truncate text-white">{s.title}</div>
                  <div className="text-xs text-slate-400 truncate">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Skeleton Dashboard Card Grid */}
        <div className="pt-6 border-t border-white/10">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
            Building Audit Dashboard...
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col justify-between overflow-hidden relative"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-white/10 rounded-md w-24 animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded-full w-12 animate-pulse"></div>
                </div>
                <div className="h-7 bg-white/10 rounded-lg w-32 animate-pulse my-2"></div>
                <div className="h-3 bg-white/5 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';
