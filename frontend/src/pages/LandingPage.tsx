import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  BrainCircuit,
  GraduationCap,
  Users,
  ShieldCheck,
  FileCheck2,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Building2,
  UserCheck,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillBadge } from '../components/SkillBadge';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreRole: (role: 'individual' | 'company') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreRole }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Subtle glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/15 via-cyan-500/10 to-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-lg shadow-purple-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explainable AI Semantic Matching & Skill Gap Analysis</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Turn Resumes into <br />
            <span className="gradient-text">Actionable Career Pathways</span> & Intelligent Hires
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TalentLoop AI analyzes resumes against target roles with multi-criteria transparency.
            Discover exact skill gaps, personalized learning roadmaps, and empower companies with automated candidate ranking.
          </p>

          {/* Dual CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onExploreRole('individual')}
              className="glow-btn w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-purple-200" />
              <span>Enter Candidate Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onExploreRole('company')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
            >
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Recruiter Bulk Screening</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Explainable AI (No Fake Numbers)</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>PDF & DOCX Multi-Format Parsing</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Curated Capstones & Roadmaps</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Card */}
        <div className="max-w-5xl mx-auto px-4 mt-16">
          <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-purple-500/20 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Column: Sample Profile */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    Live Engine Demonstration
                  </span>
                  <span className="text-xs text-slate-400">Senior Full-Stack Engineer</span>
                </div>
                <h3 className="text-xl font-bold text-white">Alex Rivera vs TechLoop Systems</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Multi-factor breakdown: Skills (45%), Experience (20%), Education (15%), Semantic Relevance (20%).
                </p>

                {/* Skills tags preview */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Matched Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <SkillBadge skill="React" variant="matched" size="sm" />
                      <SkillBadge skill="TypeScript" variant="matched" size="sm" />
                      <SkillBadge skill="Python" variant="matched" size="sm" />
                      <SkillBadge skill="FastAPI" variant="matched" size="sm" />
                      <SkillBadge skill="PostgreSQL" variant="matched" size="sm" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Identified Gaps (Critical):</span>
                    <div className="flex flex-wrap gap-1.5">
                      <SkillBadge skill="Docker" variant="missing" size="sm" />
                      <SkillBadge skill="AWS Cloud" variant="missing" size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Score Breakdown */}
              <div className="flex items-center gap-6 sm:gap-8 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                <ScoreGauge score={88.5} size="md" label="Compatibility" />

                <div className="space-y-2 text-left min-w-[140px]">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Skill Match</span>
                      <span className="font-bold text-purple-400">92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Experience Fit</span>
                      <span className="font-bold text-cyan-400">85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Education</span>
                      <span className="font-bold text-emerald-400">90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                      <span>Semantic Sim</span>
                      <span className="font-bold text-indigo-400">82%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 bg-slate-950/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Engineered for Both Sides of the Hiring Loop
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
              Whether you are an ambitious engineer preparing for top tech roles or a recruiter screening hundreds of resumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="glass-panel p-8 glass-panel-hover flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transparent Match Scoring</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                Say goodbye to arbitrary percentages. Our algorithm computes exact skill taxonomies, experience seniority, and TF-IDF document cosine similarity with clear explanations.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Exact & synonym skill resolution</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Strengths & weaknesses analysis</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel p-8 glass-panel-hover flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Skill Gap & Learning Roadmaps</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                Pinpoint exactly what is missing. Receive a 6-week structured improvement roadmap with authentic course documentation and hands-on capstone project specifications.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Critical vs Important gap sorting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Curated official tutorials & projects</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel p-8 glass-panel-hover flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bulk Candidate Screening</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                Recruiters can drag-and-drop dozens of candidate resumes against any job listing. Instantly rank candidates on a leaderboard, filter by required skills, and compare top picks.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Side-by-side head-to-head comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>One-click CSV screening export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">400+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Technical Skills Indexed
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Transparent Formula
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">&lt; 1s</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Instant Resume Parsing
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">6-Week</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Custom Upskilling Plan
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
