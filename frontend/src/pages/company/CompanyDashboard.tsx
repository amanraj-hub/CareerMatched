import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CompanyStats } from '../../types';
import {
  Briefcase,
  Users,
  TrendingUp,
  UserCheck,
  Sparkles,
  Layers,
  ArrowRight,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, jobId?: number) => void;
}

export const CompanyDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getCompanyStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching recruiter stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Recruiter Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border-cyan-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automated Talent Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recruiter & Hiring Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Screen bulk resumes with explainable NLP algorithms, eliminate hiring bias, and surface top engineering talent faster.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('comp-jobs')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Create Job</span>
            </button>
            <button
              onClick={() => onNavigate('comp-screening')}
              className="flex-1 md:flex-none glow-btn px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Bulk Screen Resumes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Job Postings</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.total_jobs || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Open positions currently screening</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Screened Candidates</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.total_candidates || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Parsed and evaluated resumes</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Match</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {stats?.average_match_score ? `${stats.average_match_score}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pipeline compatibility average</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Shortlisted Talent</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">
            {stats?.shortlisted_count || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Interviewing or advancing</p>
        </div>
      </div>

      {/* Main Grid: Skills Demanded vs Recent Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Demanded Competencies */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Top Skills Demanded in Jobs
            </h3>
            <div className="space-y-3">
              {stats?.top_skills_demanded && stats.top_skills_demanded.length > 0 ? (
                stats.top_skills_demanded.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.skill}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-mono font-bold">
                      {item.count} roles
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No skill metrics available.</p>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-white">Objective, Bias-Free Screening</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              TalentLoop AI evaluates only demonstrated technical competencies, verified experience, and semantic role alignment.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Candidates Screened */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Latest Screened Candidates
            </h3>
            <button
              onClick={() => onNavigate('comp-leaderboard')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Full Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats?.recent_candidates && stats.recent_candidates.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => onNavigate('comp-leaderboard', cand.job_id)}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {cand.candidate_name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {cand.email || 'Email provided'} • {cand.matched_skills.length} skills matched
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {cand.status}
                    </span>
                    <span className="text-base font-extrabold text-cyan-400">
                      {cand.score}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">No candidates screened yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bulk upload resumes to screen candidates against your job listings.
              </p>
              <button
                onClick={() => onNavigate('comp-screening')}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 transition-colors inline-flex items-center gap-2"
              >
                <span>Start Screening</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
