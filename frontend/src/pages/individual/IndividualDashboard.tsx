import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IndividualStats } from '../../types';
import { ScoreGauge } from '../../components/ScoreGauge';
import {
  FileText,
  Target,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string, analysisId?: number) => void;
}

export const IndividualDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [stats, setStats] = useState<IndividualStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getIndividualStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border-purple-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Intelligence Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Career Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Track your resume compatibility across target roles, monitor skill evolution, and execute personalized learning roadmaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('ind-resumes')}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Manage Resumes</span>
            </button>
            <button
              onClick={() => onNavigate('ind-match')}
              className="flex-1 md:flex-none glow-btn px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>Run AI Match</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Uploaded Resumes</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.total_resumes || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Ready for automated parsing & matching</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Analyses Run</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.total_analyses || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Multi-factor job compatibility checks</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Match</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {stats?.average_score ? `${stats.average_score}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Overall career readiness baseline</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Match Score</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400">
            {stats?.highest_score ? `${stats.highest_score}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Highest alignment achieved</p>
        </div>
      </div>

      {/* Main Grid: Strengths & Improvement vs Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Strengths and Needed Skills */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-emerald-400" />
              Top Demonstrated Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats?.top_strengths.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              High-Impact Skills to Acquire
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats?.most_needed_skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate('ind-learning')}
              className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 hover:border-cyan-500 transition-colors flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Explore Curated Roadmap</span>
            </button>
          </div>
        </div>

        {/* Right Column: Recent Analyses */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent Compatibility Analyses
            </h3>
            <button
              onClick={() => onNavigate('ind-history')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_analyses.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onNavigate('ind-history', a.id)}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {a.target_role}
                      </h4>
                      <p className="text-xs text-slate-500">{a.created_at}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold text-purple-400">{a.overall_score}%</span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">No analyses run yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Upload your resume and test it against a job description to calculate your compatibility score and identify skill gaps.
              </p>
              <button
                onClick={() => onNavigate('ind-match')}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-colors inline-flex items-center gap-2"
              >
                <span>Run First Match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
