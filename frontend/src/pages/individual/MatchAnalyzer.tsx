import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Resume, JobDescription, ResumeAnalysis } from '../../types';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';
import {
  Target,
  Sparkles,
  FileText,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Info,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  initialResumeId?: number;
  onNavigateToLearning: (analysis: ResumeAnalysis) => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const MatchAnalyzer: React.FC<Props> = ({
  initialResumeId,
  onNavigateToLearning,
  showToast,
}) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(initialResumeId || null);

  const [jobSource, setJobSource] = useState<'existing' | 'custom'>('existing');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [customJobText, setCustomJobText] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [rData, jData] = await Promise.all([api.getResumes(), api.getJobs()]);
        setResumes(rData);
        setJobs(jData);

        if (!selectedResumeId && rData.length > 0) {
          setSelectedResumeId(rData[0].id);
        }
        if (jData.length > 0) {
          setSelectedJobId(jData[0].id);
        }
      } catch (err: any) {
        showToast('error', 'Failed to load analysis options', err.message);
      }
    }
    loadData();
  }, [selectedResumeId]);

  const handleRunAnalysis = async () => {
    if (!selectedResumeId) {
      showToast('warning', 'Selection Required', 'Please select a resume to analyze.');
      return;
    }

    if (jobSource === 'existing' && !selectedJobId) {
      showToast('warning', 'Selection Required', 'Please choose a job posting.');
      return;
    }

    if (jobSource === 'custom' && (!customRoleTitle.trim() || !customJobText.trim())) {
      showToast('warning', 'Missing Details', 'Please provide both role title and job description text.');
      return;
    }

    try {
      setAnalyzing(true);
      const payload: any = { resume_id: selectedResumeId };
      if (jobSource === 'existing') {
        payload.job_id = selectedJobId;
      } else {
        payload.target_role = customRoleTitle;
        payload.job_description_text = customJobText;
      }

      const result = await api.runAnalysis(payload);
      setAnalysisResult(result);

      if (result.overall_score >= 80) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      }

      showToast('success', 'Analysis Complete', `Overall compatibility: ${result.overall_score}%`);
    } catch (err: any) {
      showToast('error', 'Analysis Failed', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Resume Match & Gap Analyzer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Evaluate compatibility across technical skills, seniority, education, and semantic relevance with full explainability.
        </p>
      </div>

      {/* Input Configuration Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Select Resume */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. Choose Candidate Resume
            </label>
            {resumes.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                No resumes found.{' '}
                <span className="text-purple-400 font-semibold cursor-pointer">
                  Upload a resume first
                </span>{' '}
                to run matching.
              </div>
            ) : (
              <select
                value={selectedResumeId || ''}
                onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                className="w-full text-sm font-medium"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.original_filename} (
                    {r.parsed_data?.candidate_name || 'Candidate'})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Choose Job Source */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              2. Target Position Source
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setJobSource('existing')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  jobSource === 'existing'
                    ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                Company Job Listings
              </button>
              <button
                type="button"
                onClick={() => setJobSource('custom')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  jobSource === 'custom'
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                Paste Custom Job
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Job Input depending on source */}
        {jobSource === 'existing' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Published Role
            </label>
            {jobs.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                No active jobs in catalog. Switch to &apos;Paste Custom Job&apos; tab.
              </div>
            ) : (
              <select
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
                className="w-full text-sm font-medium"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} • {j.department || 'Engineering'} ({j.experience_level})
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Machine Learning Engineer"
                value={customRoleTitle}
                onChange={(e) => setCustomRoleTitle(e.target.value)}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Description & Qualifications Text
              </label>
              <textarea
                rows={4}
                placeholder="Paste the full job requirements, skills, and qualifications here..."
                value={customJobText}
                onChange={(e) => setCustomJobText(e.target.value)}
                className="w-full text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing || resumes.length === 0}
          className="glow-btn w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Executing Multi-Factor AI Matching...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Calculate Compatibility & Skill Gaps</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Result Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Radial Score Gauge */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <ScoreGauge score={analysisResult.overall_score} size="lg" label="Overall Match" />
              </div>

              {/* Breakdown Bars */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Technical Skill Alignment (45% Weight)</span>
                    <span className="font-extrabold text-purple-400">
                      {analysisResult.skill_score}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResult.skill_score}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Experience Fit (20% Weight)</span>
                    <span className="font-extrabold text-cyan-400">
                      {analysisResult.experience_score}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResult.experience_score}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Education Background (15% Weight)</span>
                    <span className="font-extrabold text-emerald-400">
                      {analysisResult.education_score}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResult.education_score}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Semantic Relevance (20% Weight)</span>
                    <span className="font-extrabold text-indigo-400">
                      {analysisResult.semantic_score}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${analysisResult.semantic_score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action: Open Roadmap */}
              <div className="flex flex-col items-center justify-center gap-3 shrink-0">
                <button
                  onClick={() => onNavigateToLearning(analysisResult)}
                  className="glow-btn px-6 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>View Custom 6-Week Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400">
                  {analysisResult.missing_skills.length} skills identified to master
                </span>
              </div>
            </div>
          </div>

          {/* AI Explainability Card */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Transparent Scoring Explanation
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {analysisResult.explanation}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4" />
                Candidate Strengths
              </h3>
              <ul className="space-y-2.5">
                {analysisResult.strengths.map((str, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4" />
                Areas Requiring Improvement
              </h3>
              <ul className="space-y-2.5">
                {analysisResult.weaknesses.map((weak, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Granular Skill Breakdown
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 block mb-2">
                  Matched Competencies ({analysisResult.matched_skills.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.matched_skills.map((s, i) => (
                    <SkillBadge key={i} skill={s} variant="matched" />
                  ))}
                </div>
              </div>

              {analysisResult.partial_skills.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-amber-400 block mb-2">
                    Partially Matched / Related ({analysisResult.partial_skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.partial_skills.map((s, i) => (
                      <SkillBadge key={i} skill={s} variant="partial" />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-rose-400 block mb-2">
                  Missing Competencies ({analysisResult.missing_skills.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.missing_skills.map((s, i) => (
                    <SkillBadge key={i} skill={s} variant="missing" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
