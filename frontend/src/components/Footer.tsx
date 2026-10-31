import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/70 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-slate-300">TalentLoop AI</span>
          <span>— Intelligent Career Matching & Automated Recruitment Platform</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            Powered by FastAPI & React
          </span>
          <span>© 2026 TalentLoop AI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
