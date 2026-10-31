import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { JobDescription, CandidateScreening } from '../../types';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';
import {
  UploadCloud,
  Layers,
  Sparkles,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  X,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  initialJobId?: number | null;
  onNavigateToLeaderboard: (jobId: number) => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const BulkScreening: React.FC<Props> = ({
  initialJobId,
  onNavigateToLeaderboard,
  showToast,
}) => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(initialJobId || null);

  const [files, setFiles] = useState<File[]>([]);
  const [screening, setScreening] = useState(false);
  const [results, setResults] = useState<CandidateScreening[]>([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await api.getJobs();
        setJobs(data);
        if (!selectedJobId && data.length > 0) {
          setSelectedJobId(data[0].id);
        }
      } catch (err: any) {
        showToast('error', 'Failed to load jobs', err.message);
      }
    }
    loadJobs();
  }, [selectedJobId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedList = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedList]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleExecuteScreening = async () => {
    if (!selectedJobId) {
      showToast('warning', 'Missing Job', 'Please select a job description to screen against.');
      return;
    }
    if (files.length === 0) {
      showToast('warning', 'No Resumes', 'Please select at least one resume file to screen.');
      return;
    }

    try {
      setScreening(true);
      const screened = await api.bulkScreenResumes(selectedJobId, files);
      setResults(screened);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });

      showToast(
        'success',
        'Bulk Screening Completed',
        `Successfully screened and ranked ${screened.length} candidates.`
      );
    } catch (err: any) {
      showToast('error', 'Screening Failed', err.message);
    } finally {
      setScreening(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Automated Bulk Candidate Screening
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload batches of applicant resumes (PDF, DOCX, TXT) to automatically parse credentials, compute multi-criteria compatibility, and rank candidates.
        </p>
      </div>

      {/* Configuration Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
        {/* Step 1: Target Job Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            1. Select Target Job Description
          </label>
          {jobs.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              No active job descriptions. Please create a job posting first.
            </div>
          ) : (
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="w-full text-sm font-medium"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} • {job.department || 'Engineering'} ({job.experience_level})
                </option>
              ))}
            </select>
          )}

          {selectedJob && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-300">Target Skills:</span>
              {selectedJob.required_skills.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/40"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Bulk Resume File Drop */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            2. Upload Candidate Resumes (Multiple Files Allowed)
          </label>
          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl bg-slate-950/50 hover:bg-slate-950/80 cursor-pointer transition-all group">
            <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
            <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Click to select or drag and drop candidate resumes
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Supports .pdf, .docx, .txt (up to 50 resumes per batch)
            </span>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Selected Files Chips */}
        {files.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Selected Resumes ({files.length}):</span>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
              {files.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-[150px]">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleExecuteScreening}
          disabled={screening || files.length === 0 || !selectedJobId}
          className="glow-btn w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {screening ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Parsing Resumes & Running Semantic Matching...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Execute Bulk AI Candidate Screening ({files.length} Files)</span>
            </>
          )}
        </button>
      </div>

      {/* Screened Candidates Leaderboard Preview */}
      {results.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border-cyan-500/30 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                Screening Results
              </span>
              <h2 className="text-xl font-bold text-white">
                Ranked Candidates ({results.length})
              </h2>
            </div>

            <button
              onClick={() => selectedJobId && onNavigateToLeaderboard(selectedJobId)}
              className="glow-btn px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-2 shadow-md shadow-cyan-600/25"
            >
              <Users className="w-4 h-4" />
              <span>Open Full Interactive Leaderboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4">Matched Competencies</th>
                  <th className="py-3 px-4">Missing Skills</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {results.map((c, i) => (
                  <tr key={c.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      {i === 0 ? '🥇 #1' : i === 1 ? '🥈 #2' : i === 2 ? '🥉 #3' : `#${i + 1}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{c.candidate_name}</div>
                      <div className="text-[11px] text-slate-400">{c.email || c.resume_filename}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-sm text-cyan-400">{c.score}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {c.matched_skills.slice(0, 4).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                          >
                            {s}
                          </span>
                        ))}
                        {c.matched_skills.length > 4 && (
                          <span className="text-[10px] text-slate-500 font-semibold self-center">
                            +{c.matched_skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {c.missing_skills.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/40"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
