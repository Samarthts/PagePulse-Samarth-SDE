import React from 'react';
import { Loader2, Globe, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

export const LoadingState = ({ step = 1 }) => {
  const steps = [
    { title: 'DNS Resolution & Connection', desc: 'Establishing secure HTTP connection to target server' },
    { title: 'Fetching HTML & Response Headers', desc: 'Measuring latency and inspecting server payload' },
    { title: 'DOM & Metadata Extraction', desc: 'Parsing title, H1 distribution, images, and alt attributes' },
    { title: 'SEO Score Computation', desc: 'Aggregating health indicators and finalizing report' }
  ];

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
        {/* Top Shimmer Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shimmer-effect"></div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Auditing Target Website</h3>
          <p className="text-sm text-slate-400 mt-1">Please wait while Page Pulse analyzes website performance and SEO structure</p>
        </div>

        {/* Steps Progress */}
        <div className="space-y-4 max-w-xl mx-auto">
          {steps.map((s, index) => {
            const stepNum = index + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-950/50 border-indigo-500/40 text-white shadow-md'
                    : isDone
                    ? 'bg-slate-900/40 border-emerald-500/30 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs text-slate-400 font-mono">
                      {stepNum}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-semibold truncate">{s.title}</div>
                  <div className="text-xs text-slate-400 truncate">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skeleton Preview Grid */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-40">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3 animate-pulse">
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              <div className="h-6 bg-slate-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
