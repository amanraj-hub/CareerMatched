import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CandidateScreening } from '../../types';
import { ScoreGauge } from '../../components/ScoreGauge';
import { SkillBadge } from '../../components/SkillBadge';
import {
  X,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Save,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface Props {
  candidateId: number;
  onClose: () => void;
  onStatusUpdated: () => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const CandidateDetailModal: React.FC<Props> = ({
  candidateId,
  onClose,
  onStatusUpdated,
  showToast,
}) => {
  const [candidate, setCandidate] = useState<CandidateScreening | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    async function loadCandidate() {
      try {
        setLoading(true);
        const data = await api.getCandidateDetail(candidateId);
        setCandidate(data);
        setNotes(data.recruiter_notes || '');
      } catch (err: any) {
        showToast('error', 'Failed to load candidate', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [candidateId]);

  const handleUpdateStatus = async (status: string) => {
    if (!candidate) return;
    try {
      const updated = await api.updateCandidateStatus(candidate.id, status, notes);
      setCandidate(updated);
      onStatusUpdated();
      showToast('success', 'Status Updated', `Candidate marked as ${status}.`);
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!candidate) return;
    try {
      setSavingNotes(true);
      const updated = await api.updateCandidateStatus(candidate.id, candidate.status, notes);
      setCandidate(updated);
      onStatusUpdated();
      showToast('success', 'Recruiter Notes Saved');
    } catch (err: any) {
      showToast('error', 'Failed to save notes', err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{candidate.candidate_name}</h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {candidate.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {candidate.email || 'No email provided'} • {candidate.phone || 'No phone'}
            </p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Resume: {candidate.resume_filename}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateStatus('shortlisted')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition-all"
            >
              Shortlist
            </button>
            <button
              onClick={() => handleUpdateStatus('interviewing')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white border border-cyan-500/30 transition-all"
            >
              Interview
            </button>
            <button
              onClick={() => handleUpdateStatus('rejected')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition-all"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Score & Dimensions */}
        <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
          <ScoreGauge score={candidate.score} size="md" label="Compatibility" />

          <div className="flex-1 w-full space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                <span>Technical Skills Fit (45%)</span>
                <span className="font-bold text-purple-400">{candidate.skill_score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${candidate.skill_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                <span>Experience Seniority (20%)</span>
                <span className="font-bold text-cyan-400">{candidate.experience_score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${candidate.experience_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                <span>Education Background (15%)</span>
                <span className="font-bold text-emerald-400">{candidate.education_score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${candidate.education_score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-0.5">
                <span>Semantic Similarity (20%)</span>
                <span className="font-bold text-indigo-400">{candidate.semantic_score}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${candidate.semantic_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Explainability */}
        {candidate.explanation && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Evaluation Analysis</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {candidate.explanation}
            </p>
          </div>
        )}

        {/* Skills Matched and Missing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 block mb-1.5">
              Matched Skills ({candidate.matched_skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {candidate.matched_skills.map((s, i) => (
                <SkillBadge key={i} skill={s} variant="matched" size="sm" />
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-rose-400 block mb-1.5">
              Missing Skills ({candidate.missing_skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {candidate.missing_skills.map((s, i) => (
                <SkillBadge key={i} skill={s} variant="missing" size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Recruiter Notes Section */}
        <div className="pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Internal Hiring Notes
          </label>
          <textarea
            rows={3}
            placeholder="Add recruiter feedback, interview remarks, or next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs resize-none mb-2"
          />
          <button
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="glow-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
