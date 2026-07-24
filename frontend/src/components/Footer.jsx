import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer = React.memo(() => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0A0A0A]/90 mt-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-base sm:text-lg text-slate-200">
        
        {/* Left Branding & Internship Requirement Footer */}
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
          <span className="font-extrabold text-white">Page Pulse © {new Date().getFullYear()}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            Built for{' '}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-black underline underline-offset-4 flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              Digital Heroes Training Task
              <ExternalLink className="w-4 h-4 inline" />
            </a>
          </span>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm font-mono font-bold text-slate-100">
            FastAPI + Python
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm font-mono font-bold text-slate-100">
            React 19 + Vite
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm font-mono font-bold text-slate-100">
            Tailwind CSS + Framer Motion
          </span>
        </div>

      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
