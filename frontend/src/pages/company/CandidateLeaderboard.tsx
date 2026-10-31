import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { JobDescription, CandidateScreening } from '../../types';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';
import {
  Users,
  Search,
  Filter,
  Download,
  GitCompare,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialJobId?: number | null;
  onCompareCandidates: (candidateIds: number[]) => void;
  onOpenCandidateDetail: (candidateId: number) => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const CandidateLeaderboard: React.FC<Props> = ({
  initialJobId,
  onCompareCandidates,
  onOpenCandidateDetail,
  showToast,
}) => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(initialJobId || null);

  const [candidates, setCandidates] = useState<CandidateScreening[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [minScore, setMinScore] = useState<number>(0);
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected candidates for side-by-side comparison
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jList = await api.getJobs();
        setJobs(jList);
        if (!selectedJobId && jList.length > 0) {
          setSelectedJobId(jList[0].id);
        }
      } catch (err: any) {
        showToast('error', 'Failed to fetch jobs', err.message);
      }
    }
    fetchJobs();
  }, [selectedJobId]);

  useEffect(() => {
    if (selectedJobId) {
      loadLeaderboard(selectedJobId);
    }
  }, [selectedJobId, minScore, skillFilter, statusFilter, searchQuery]);

  const loadLeaderboard = async (jobId: number) => {
    try {
      setLoading(true);
      const data = await api.getLeaderboard(jobId, {
        min_score: minScore > 0 ? minScore : undefined,
        skill_filter: skillFilter || undefined,
        status_filter: statusFilter || undefined,
        search: searchQuery || undefined,
      });
      setCandidates(data);
    } catch (err: any) {
      showToast('error', 'Failed to load leaderboard', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (screeningId: number, newStatus: string) => {
    try {
      const updated = await api.updateCandidateStatus(screeningId, newStatus);
      setCandidates(candidates.map((c) => (c.id === screeningId ? updated : c)));
      showToast('success', 'Status Updated', `Candidate marked as ${newStatus}.`);
    } catch (err: any) {
      showToast('error', 'Failed to update status', err.message);
    }
  };

  const toggleSelectForCompare = (id: number) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 4) {
        showToast('warning', 'Limit Reached', 'You can compare at most 4 candidates at once.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleExportCSV = () => {
    if (!selectedJobId) return;
    window.open(api.exportCSVUrl(selectedJobId), '_blank');
    showToast('success', 'Report Exported', 'Downloading screening report CSV.');
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Header with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Candidate Leaderboard & Rankings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Rank applicants by multi-factor compatibility score, filter by core technical skills, and compare top contenders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={!selectedJobId || candidates.length === 0}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Job Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Position
            </label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => {
                setSelectedJobId(Number(e.target.value));
                setSelectedForCompare([]);
              }}
              className="w-full text-xs font-semibold"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.experience_level})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Candidate Search */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Search Candidate
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 text-xs"
              />
            </div>
          </div>

          {/* 3. Skill Filter Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Filter by Required Skill
            </label>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full text-xs font-medium"
            >
              <option value="">All Skills</option>
              {selectedJob?.required_skills.map((s, i) => (
                <option key={i} value={s}>
                  Must have: {s}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Status Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Recruitment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-medium"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Minimum Score Slider */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
              Minimum Compatibility Score: <span className="text-cyan-400 font-bold">{minScore}%</span>
            </span>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full max-w-xs cursor-pointer"
            />
          </div>

          {selectedForCompare.length >= 2 && (
            <button
              onClick={() => onCompareCandidates(selectedForCompare)}
              className="glow-btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-2 shadow-md shadow-cyan-600/25 self-start sm:self-auto"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Selected ({selectedForCompare.length}) Candidates</span>
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">Filtering leaderboard...</div>
        ) : candidates.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No candidates match current criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting the score slider or clearing your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-4 text-center w-12">Select</th>
                  <th className="py-4 px-4 w-16">Rank</th>
                  <th className="py-4 px-4">Candidate Details</th>
                  <th className="py-4 px-4 text-center">Score</th>
                  <th className="py-4 px-4">Competency Breakdown</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {candidates.map((cand, index) => {
                  const isChecked = selectedForCompare.includes(cand.id);
                  return (
                    <tr
                      key={cand.id}
                      className={`hover:bg-slate-950/40 transition-colors ${
                        isChecked ? 'bg-cyan-950/20' : ''
                      }`}
                    >
                      {/* Checkbox for side-by-side comparison */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectForCompare(cand.id)}
                          className="w-4 h-4 rounded cursor-pointer accent-cyan-500"
                        />
                      </td>

                      {/* Rank */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-sm text-slate-300">
                          {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                        </span>
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-4 px-4">
                        <div
                          className="font-bold text-sm text-white hover:text-cyan-300 cursor-pointer transition-colors"
                          onClick={() => onOpenCandidateDetail(cand.id)}
                        >
                          {cand.candidate_name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {cand.email || 'No email'} • {cand.phone || 'No phone'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {cand.resume_filename}
                        </div>
                      </td>

                      {/* Overall Compatibility Score */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-lg font-black text-cyan-400">{cand.score}%</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                            {cand.score >= 85 ? 'Exceptional' : cand.score >= 70 ? 'Strong' : 'Moderate'}
                          </span>
                        </div>
                      </td>

                      {/* Skills breakdown */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 max-w-sm">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">
                              Matched ({cand.matched_skills.length}):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {cand.matched_skills.slice(0, 4).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                                >
                                  {s}
                                </span>
                              ))}
                              {cand.matched_skills.length > 4 && (
                                <span className="text-[10px] text-slate-500 self-center">
                                  +{cand.matched_skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>

                          {cand.missing_skills.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold text-rose-400 block mb-0.5">
                                Gaps ({cand.missing_skills.length}):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {cand.missing_skills.slice(0, 3).map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/40"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Recruitment Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={cand.status}
                          onChange={(e) => handleStatusChange(cand.id, e.target.value)}
                          className="text-xs font-bold uppercase rounded-lg bg-slate-900 border border-slate-700 py-1 px-2.5"
                        >
                          <option value="new">New</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => onOpenCandidateDetail(cand.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/40 transition-colors"
                        >
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Compare Action Bar when candidates are selected */}
      {selectedForCompare.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-cyan-500/50 shadow-2xl rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white">
              {selectedForCompare.length} candidates selected for side-by-side comparison
            </span>
          </div>
          <button
            onClick={() => onCompareCandidates(selectedForCompare)}
            className="glow-btn px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2"
          >
            <GitCompare className="w-4 h-4" />
            <span>Launch Comparison</span>
          </button>
          <button
            onClick={() => setSelectedForCompare([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  );
};
