import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ResumeAnalysis } from '../../types';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';
import {
  History,
  Target,
  Clock,
  Briefcase,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface Props {
  selectedAnalysisId?: number | null;
  onOpenLearning: (analysis: ResumeAnalysis) => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const AnalysisHistory: React.FC<Props> = ({
  selectedAnalysisId,
  onOpenLearning,
  showToast,
}) => {
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalyses() {
      try {
        setLoading(true);
        const data = await api.getAnalyses();
        setAnalyses(data);

        if (selectedAnalysisId) {
          const match = data.find((a) => a.id === selectedAnalysisId);
          if (match) setSelectedAnalysis(match);
        } else if (data.length > 0) {
          setSelectedAnalysis(data[0]);
        }
      } catch (err: any) {
        showToast('error', 'Failed to load analysis history', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAnalyses();
  }, [selectedAnalysisId]);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Resume Analysis Archive & Progress Tracking
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review historical compatibility assessments across all job descriptions and monitor skill gap progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Analyses List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="glass-panel p-5 rounded-2xl border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              <span>Conducted Analyses ({analyses.length})</span>
            </h3>

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs">Loading records...</div>
            ) : analyses.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No analyses completed yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {analyses.map((a) => {
                  const isSelected = selectedAnalysis?.id === a.id;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAnalysis(a)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-950/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isSelected
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">
                              {a.target_role}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {new Date(a.created_at).toLocaleDateString()} •{' '}
                              {a.matched_skills.length} matched skills
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-extrabold text-purple-400">
                            {a.overall_score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected Analysis Dossier */}
        <div className="lg:col-span-7">
          {selectedAnalysis ? (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                    Target Role Assessment
                  </span>
                  <h2 className="text-xl font-bold text-white">{selectedAnalysis.target_role}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluated on {new Date(selectedAnalysis.created_at).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => onOpenLearning(selectedAnalysis)}
                  className="glow-btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center gap-2 self-start sm:self-auto shadow-md shadow-purple-500/25"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Learning Path</span>
                </button>
              </div>

              {/* Gauge and Breakdown */}
              <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                <ScoreGauge score={selectedAnalysis.overall_score} size="md" label="Compatibility" />

                <div className="flex-1 w-full space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Skills Match</span>
                      <span className="font-bold text-purple-400">
                        {selectedAnalysis.skill_score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${selectedAnalysis.skill_score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Experience Fit</span>
                      <span className="font-bold text-cyan-400">
                        {selectedAnalysis.experience_score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${selectedAnalysis.experience_score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Education Background</span>
                      <span className="font-bold text-emerald-400">
                        {selectedAnalysis.education_score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${selectedAnalysis.education_score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Semantic Relevance</span>
                      <span className="font-bold text-indigo-400">
                        {selectedAnalysis.semantic_score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${selectedAnalysis.semantic_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanation Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  AI Matching Explanation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {selectedAnalysis.explanation}
                </p>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 block mb-1.5">
                    Matched Skills ({selectedAnalysis.matched_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAnalysis.matched_skills.map((s, i) => (
                      <SkillBadge key={i} skill={s} variant="matched" size="sm" />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-rose-400 block mb-1.5">
                    Missing Skills ({selectedAnalysis.missing_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAnalysis.missing_skills.map((s, i) => (
                      <SkillBadge key={i} skill={s} variant="missing" size="sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl border-slate-800">
              <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-400">
                Select an analysis to inspect detailed breakdown
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
