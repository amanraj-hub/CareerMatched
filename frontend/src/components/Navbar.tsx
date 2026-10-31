import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Target,
  GraduationCap,
  History,
  Briefcase,
  Users,
  Layers,
  LogOut,
  UserCheck,
  Building2,
  GitCompare,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { user, logout } = useAuth();

  const isCompany = user?.role === 'company';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSelectTab('landing')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              TalentLoop AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
              v2.0
            </span>
          </div>
        </div>

        {/* Portal Nav Links */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1">
            {!isCompany ? (
              // Individual Candidate Links
              <>
                <button
                  onClick={() => onSelectTab('ind-dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'ind-dashboard'
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => onSelectTab('ind-resumes')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'ind-resumes'
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Resumes
                </button>
                <button
                  onClick={() => onSelectTab('ind-match')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'ind-match'
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  Match Analyzer
                </button>
                <button
                  onClick={() => onSelectTab('ind-learning')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'ind-learning'
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Learning Path
                </button>
                <button
                  onClick={() => onSelectTab('ind-history')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'ind-history'
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
              </>
            ) : (
              // Company Recruiter Links
              <>
                <button
                  onClick={() => onSelectTab('comp-dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'comp-dashboard'
                      ? 'bg-cyan-600/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </button>
                <button
                  onClick={() => onSelectTab('comp-jobs')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'comp-jobs'
                      ? 'bg-cyan-600/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Job Postings
                </button>
                <button
                  onClick={() => onSelectTab('comp-screening')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'comp-screening'
                      ? 'bg-cyan-600/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Bulk Screening
                </button>
                <button
                  onClick={() => onSelectTab('comp-leaderboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'comp-leaderboard'
                      ? 'bg-cyan-600/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Leaderboard
                </button>
              </>
            )}
          </nav>
        ) : null}

        {/* Right Side: User Profile / Auth Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Role Indicator Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700">
                {isCompany ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-300">Company Portal</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-300">Candidate Portal</span>
                  </>
                )}
              </div>

              {/* User Name */}
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-slate-200 leading-tight">
                  {user.full_name}
                </div>
                <div className="text-[11px] text-slate-400">{user.email}</div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="glow-btn px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
