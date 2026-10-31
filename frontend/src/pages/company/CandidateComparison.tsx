import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CandidateScreening } from '../../types';
import { ScoreGauge } from '../../components/ScoreGauge';
import {
  GitCompare,
  ArrowLeft,
  Check,
  X,
  UserCheck,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  candidateIds: number[];
  onBack: () => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const CandidateComparison: React.FC<Props> = ({ candidateIds, onBack, showToast }) => {
  const [data, setData] = useState<{
    job_title: string;
    job_required_skills: string[];
    candidates: CandidateScreening[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComparison() {
      try {
        setLoading(true);
        const res = await api.compareCandidates(candidateIds);
        setData(res);
      } catch (err: any) {
        showToast('error', 'Comparison Failed', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, [candidateIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.candidates.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl border-slate-800 space-y-4">
        <GitCompare className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No comparison data available</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white"
        >
          Return to Leaderboard
        </button>
      </div>
    );
  }

  const { job_title, job_required_skills, candidates } = data;

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800/40 mb-1">
              Side-by-Side Head-to-Head
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Evaluation Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Role: {job_title}</p>
          </div>
        </div>
      </div>

      {/* Top Cards: Candidate Profiles & Overall Gauges */}
      <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(candidates.length, 4)} gap-6`}>
        {candidates.map((c, i) => (
          <div
            key={c.id}
            className="glass-panel p-6 rounded-2xl border-slate-800 text-center flex flex-col items-center justify-between"
          >
            <div className="w-full">
              <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">
                Candidate 0{i + 1}
              </span>
              <h3 className="text-lg font-bold text-white mb-0.5">{c.candidate_name}</h3>
              <p className="text-xs text-slate-400 mb-6">{c.email || 'Email on file'}</p>

              <div className="flex justify-center mb-6">
                <ScoreGauge score={c.score} size="md" label="Compatibility" />
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold uppercase text-cyan-400">{c.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Matched Skills:</span>
                <span className="font-bold text-emerald-400">{c.matched_skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Missing Gaps:</span>
                <span className="font-bold text-rose-400">{c.missing_skills.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Factor Breakdown Comparison Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Multi-Factor Dimension Comparison</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5 w-1/4">Evaluation Dimension</th>
                {candidates.map((c) => (
                  <th key={c.id} className="py-3 px-5 text-center font-bold text-slate-200">
                    {c.candidate_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {/* Technical Skills */}
              <tr className="hover:bg-slate-950/40">
                <td className="py-3.5 px-5 font-semibold text-slate-300">
                  Technical Skill Fit (45% Weight)
                </td>
                {candidates.map((c) => (
                  <td key={c.id} className="py-3.5 px-5 text-center font-extrabold text-sm text-purple-400">
                    {c.skill_score}%
                  </td>
                ))}
              </tr>

              {/* Experience */}
              <tr className="hover:bg-slate-950/40">
                <td className="py-3.5 px-5 font-semibold text-slate-300">
                  Experience Seniority (20% Weight)
                </td>
                {candidates.map((c) => (
                  <td key={c.id} className="py-3.5 px-5 text-center font-extrabold text-sm text-cyan-400">
                    {c.experience_score}%
                  </td>
                ))}
              </tr>

              {/* Education */}
              <tr className="hover:bg-slate-950/40">
                <td className="py-3.5 px-5 font-semibold text-slate-300">
                  Education Background (15% Weight)
                </td>
                {candidates.map((c) => (
                  <td key={c.id} className="py-3.5 px-5 text-center font-extrabold text-sm text-emerald-400">
                    {c.education_score}%
                  </td>
                ))}
              </tr>

              {/* Semantic Relevance */}
              <tr className="hover:bg-slate-950/40">
                <td className="py-3.5 px-5 font-semibold text-slate-300">
                  Semantic Role Relevance (20% Weight)
                </td>
                {candidates.map((c) => (
                  <td key={c.id} className="py-3.5 px-5 text-center font-extrabold text-sm text-indigo-400">
                    {c.semantic_score}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Competency Matrix (Skills by Candidate) */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Target Skills Matrix Check</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5 w-1/4">Required Skill</th>
                {candidates.map((c) => (
                  <th key={c.id} className="py-3 px-5 text-center font-bold text-slate-200">
                    {c.candidate_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {job_required_skills.map((skill, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40">
                  <td className="py-3 px-5 font-semibold text-slate-200">{skill}</td>
                  {candidates.map((c) => {
                    const hasSkill = c.matched_skills.some(
                      (ms) => ms.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <td key={c.id} className="py-3 px-5 text-center">
                        {hasSkill ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
