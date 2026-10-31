import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { JobDescription } from '../../types';
import {
  Briefcase,
  PlusCircle,
  Trash2,
  Users,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  X,
  Check,
  Tag
} from 'lucide-react';

interface Props {
  onNavigateToScreening: (jobId: number) => void;
  onNavigateToLeaderboard: (jobId: number) => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const JobManager: React.FC<Props> = ({
  onNavigateToScreening,
  onNavigateToLeaderboard,
  showToast,
}) => {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Remote');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [minYearsExperience, setMinYearsExperience] = useState(2.0);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [qualifications, setQualifications] = useState('');

  const [requiredSkillInput, setRequiredSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);

  const [preferredSkillInput, setPreferredSkillInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState<string[]>(['Docker', 'AWS']);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobs();
      setJobs(data);
    } catch (err: any) {
      showToast('error', 'Failed to load jobs', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequiredSkill = () => {
    if (requiredSkillInput.trim() && !requiredSkills.includes(requiredSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, requiredSkillInput.trim()]);
      setRequiredSkillInput('');
    }
  };

  const handleRemoveRequiredSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleAddPreferredSkill = () => {
    if (preferredSkillInput.trim() && !preferredSkills.includes(preferredSkillInput.trim())) {
      setPreferredSkills([...preferredSkills, preferredSkillInput.trim()]);
      setPreferredSkillInput('');
    }
  };

  const handleRemovePreferredSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter((s) => s !== skill));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('warning', 'Missing Fields', 'Title and description are required.');
      return;
    }

    try {
      setSaving(true);
      const newJob = await api.createJob({
        title,
        department,
        location,
        employment_type: employmentType,
        experience_level: experienceLevel,
        min_years_experience: minYearsExperience,
        description,
        responsibilities,
        qualifications,
        required_skills: requiredSkills,
        preferred_skills: preferredSkills,
      });

      setJobs([newJob, ...jobs]);
      setShowCreateModal(false);
      showToast('success', 'Job Posting Created', `Successfully created ${newJob.title}.`);

      // Reset form
      setTitle('');
      setDescription('');
      setResponsibilities('');
      setQualifications('');
    } catch (err: any) {
      showToast('error', 'Failed to create job', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.deleteJob(id);
      setJobs(jobs.filter((j) => j.id !== id));
      showToast('success', 'Job Deleted');
    } catch (err: any) {
      showToast('error', 'Failed to delete job', err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Job Descriptions & Screening Criteria
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure target technical competencies, minimum seniority, and job responsibilities for automated candidate matching.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="glow-btn px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Job</span>
        </button>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">Loading job postings...</div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No active job listings</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Create your first job listing to begin bulk screening candidate resumes.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            Create Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel p-6 sm:p-7 rounded-2xl border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                      {job.department || 'Engineering'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{job.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {job.experience_level} ({job.min_years_experience}+ Yrs)
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="space-y-2 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {job.required_skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onNavigateToScreening(job.id)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-600/20"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Bulk Screen</span>
                </button>
                <button
                  onClick={() => onNavigateToLeaderboard(job.id)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Leaderboard</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Create Job Posting</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define role requirements for AI resume compatibility matching.
              </p>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Platform Engineering"
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote / San Francisco, CA"
                    className="w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full text-sm"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Min. Years Exp</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={minYearsExperience}
                    onChange={(e) => setMinYearsExperience(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Description & Responsibilities *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide role description, expectations, and day-to-day duties..."
                  className="w-full text-sm resize-none"
                />
              </div>

              {/* Required Skills Tag Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Required Competencies (Skills)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requiredSkillInput}
                    onChange={(e) => setRequiredSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequiredSkill();
                      }
                    }}
                    placeholder="Type skill & press Enter (e.g. Python, Docker, React)"
                    className="flex-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequiredSkill}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {requiredSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700/50 flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequiredSkill(s)}
                        className="text-cyan-400 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="glow-btn px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Publish Job</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
