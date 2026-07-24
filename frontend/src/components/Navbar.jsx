import React from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export const Navbar = React.memo(({ onReset }) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <button 
          onClick={onReset}
          className="flex items-center gap-3.5 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1 -ml-1 transition-all cursor-pointer"
          aria-label="PagePulse Home - Reset Audit"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-white flex items-center">
              Page<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Pulse</span>
            </span>
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase -mt-1">
              Website Auditor & SEO Engine
            </span>
          </div>
        </button>

        {/* Navigation & Status Badges */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.05] border border-white/10 text-sm text-slate-200 font-bold shadow-inner"
            role="status"
            aria-live="polite"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FastAPI Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Open FastAPI Swagger API Documentation"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="hidden xs:inline">API</span> Docs
          </a>

          <a
            href="https://github.com/Samarthts/PagePulse-Samarth-SDE"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="GitHub Repository"
            title="GitHub Repository"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';
