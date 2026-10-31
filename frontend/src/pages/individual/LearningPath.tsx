import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ResumeAnalysis, SkillGapDetail } from '../../types';
import { SkillBadge } from '../../components/SkillBadge';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  FolderGit2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Code2
} from 'lucide-react';

interface Props {
  currentAnalysis?: ResumeAnalysis | null;
  onNavigateToMatch: () => void;
}

export const LearningPath: React.FC<Props> = ({ currentAnalysis, onNavigateToMatch }) => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(currentAnalysis || null);
  const [loading, setLoading] = useState(!currentAnalysis);

  useEffect(() => {
    async function fetchLatestAnalysis() {
      if (!analysis) {
        try {
          const analyses = await api.getAnalyses();
          if (analyses.length > 0) {
            // Get full detail of the latest analysis including gap report
            const fullAnalysis = await api.getAnalysisById(analyses[0].id);
            setAnalysis(fullAnalysis);
          }
        } catch (err) {
          console.error('Error fetching learning roadmap', err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLatestAnalysis();
  }, [analysis]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysis || !analysis.gap_analysis) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl border-slate-800 space-y-4">
        <GraduationCap className="w-14 h-14 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Learning Pathway Generated Yet</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Run an AI match analysis against a target job to uncover specific skill gaps and generate a custom 6-week curriculum with authentic course recommendations.
        </p>
        <button
          onClick={onNavigateToMatch}
          className="glow-btn px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 inline-flex items-center gap-2"
        >
          <span>Run Match Analysis</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const gap = analysis.gap_analysis;

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Role: {analysis.target_role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Skill Gap & Upskilling Roadmap
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A structured career pathway tailored specifically to bridge identified missing competencies and build production portfolio projects.
          </p>
        </div>
      </div>

      {/* Categorized Missing Skills Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Critical Gaps */}
        <div className="glass-panel p-6 rounded-2xl border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">
              Critical Competencies
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
              High Priority
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Core requirements explicitly demanded by the target role.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gap.critical_skills.length > 0 ? (
              gap.critical_skills.map((s, i) => (
                <SkillBadge key={i} skill={s} variant="critical" />
              ))
            ) : (
              <span className="text-xs text-slate-500">No critical gaps detected!</span>
            )}
          </div>
        </div>

        {/* Important Gaps */}
        <div className="glass-panel p-6 rounded-2xl border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Important Skills
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              Medium Priority
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Supporting tools, frameworks, and architecture patterns.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gap.important_skills.length > 0 ? (
              gap.important_skills.map((s, i) => (
                <SkillBadge key={i} skill={s} variant="partial" />
              ))
            ) : (
              <span className="text-xs text-slate-500">None</span>
            )}
          </div>
        </div>

        {/* Additional Gaps */}
        <div className="glass-panel p-6 rounded-2xl border-purple-500/30 bg-purple-950/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">
              Additional Skills
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              Nice to Have
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Peripheral technologies that elevate candidate seniority.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gap.additional_skills.length > 0 ? (
              gap.additional_skills.map((s, i) => (
                <SkillBadge key={i} skill={s} variant="neutral" />
              ))
            ) : (
              <span className="text-xs text-slate-500">None</span>
            )}
          </div>
        </div>
      </div>

      {/* 6-Week Structured Roadmap */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">6-Week Step-by-Step Learning Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {gap.learning_path.map((phase, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                  {phase.timeline}
                </span>
                <span className="text-xs text-slate-500 font-mono">0{i + 1}</span>
              </div>

              <h4 className="text-sm font-bold text-white mt-1 mb-2">{phase.phase}</h4>

              <div className="mb-3">
                <span className="text-[11px] text-slate-400 block mb-1">Focus Areas:</span>
                <div className="flex flex-wrap gap-1">
                  {phase.focus_skills.map((fs, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-purple-300 border border-slate-800"
                    >
                      {fs}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 flex-1">
                {phase.milestone}
              </p>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-cyan-300">
                <span className="font-bold text-[10px] uppercase tracking-wider block text-slate-400 mb-0.5">
                  Deliverable:
                </span>
                {phase.deliverable}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Authentic Courses & Documentation */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">
            Curated Online Courses & Official Documentation
          </h2>
        </div>
        <p className="text-xs text-slate-400 -mt-3">
          All courses and tutorials are authentic, top-tier resources from verified institutions (React Docs, Harvard CS50, freeCodeCamp, DeepLearning.AI, PostgreSQL Global Group).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(gap.resources_by_skill).map(([skill, resources]) =>
            resources.map((res, i) => (
              <div
                key={`${skill}-${i}`}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                      {skill}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {res.duration}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5">{res.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-400">{res.platform}</span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="glow-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Launch Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Practical Portfolio Projects */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">
            Hands-On Portfolio Projects to Prove Mastery
          </h2>
        </div>
        <p className="text-xs text-slate-400 -mt-3">
          Build these targeted projects to demonstrate real-world competency in your resume and interviews.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gap.projects.map((proj, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    {proj.difficulty}
                  </span>
                  <Code2 className="w-4 h-4 text-slate-500" />
                </div>

                <h3 className="text-base font-bold text-white mb-2">{proj.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{proj.overview}</p>

                {/* Tech Stack */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Recommended Tech Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech_stack.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 text-cyan-300 border border-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    Architecture & Features:
                  </span>
                  <ul className="space-y-1.5">
                    {proj.key_features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Demonstrated Competencies:
                </span>
                <p className="text-xs text-purple-300 font-medium">
                  {proj.learning_outcomes.join(' • ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
