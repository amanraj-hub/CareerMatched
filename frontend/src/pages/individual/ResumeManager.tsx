import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Resume } from '../../types';
import {
  UploadCloud,
  FileText,
  Trash2,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  onSelectForMatch: (resumeId: number) => void;
  showToast: (type: 'success' | 'error' | 'warning', title: string, message?: string) => void;
}

export const ResumeManager: React.FC<Props> = ({ onSelectForMatch, showToast }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await api.getResumes();
      setResumes(data);
      if (data.length > 0 && !selectedResume) {
        setSelectedResume(data[0]);
      }
    } catch (err: any) {
      showToast('error', 'Failed to load resumes', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Maximum allowed file size is 10MB.');
      return;
    }

    try {
      setUploading(true);
      const newResume = await api.uploadResume(file);
      setResumes([newResume, ...resumes]);
      setSelectedResume(newResume);
      showToast('success', 'Resume Uploaded & Parsed Successfully', `Extracted skills and contact information.`);
    } catch (err: any) {
      showToast('error', 'Upload Failed', err.message);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteResume = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.deleteResume(id);
      const remaining = resumes.filter((r) => r.id !== id);
      setResumes(remaining);
      if (selectedResume?.id === id) {
        setSelectedResume(remaining[0] || null);
      }
      showToast('success', 'Resume Deleted');
    } catch (err: any) {
      showToast('error', 'Failed to delete resume', err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Resume & Document Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload PDF, DOCX, or TXT resumes. Our NLP parser extracts competencies, contact details, and career history.
          </p>
        </div>

        {/* Upload Button */}
        <label className="glow-btn cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 self-start sm:self-auto">
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          <span>{uploading ? 'Parsing Resume...' : 'Upload New Resume'}</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Layout: List of Resumes + Parsed Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Resumes List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Your Uploaded Resumes ({resumes.length})</span>
            </h3>

            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs">Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-xl p-6">
                <UploadCloud className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">No resumes uploaded yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Upload a PDF or DOCX resume to start analyzing match scores.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {resumes.map((resume) => {
                  const isSelected = selectedResume?.id === resume.id;
                  return (
                    <div
                      key={resume.id}
                      onClick={() => setSelectedResume(resume)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-950/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2.5 rounded-xl shrink-0 ${
                              isSelected
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">
                              {resume.original_filename}
                            </h4>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              <span className="uppercase font-semibold text-purple-400">
                                {resume.file_type}
                              </span>
                              <span>{(resume.file_size_bytes / 1024).toFixed(1)} KB</span>
                              <span>{new Date(resume.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume.id);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Scanned warning badge */}
                      {resume.is_scanned && (
                        <div className="mt-2 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Scanned document detected. OCR recommended.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Parsed Resume Dossier */}
        <div className="lg:col-span-7">
          {selectedResume ? (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 space-y-6">
              {/* Header with Quick Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">
                      {selectedResume.parsed_data?.candidate_name || 'Candidate Profile'}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Parsed
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedResume.parsed_data?.email || 'No email detected'} •{' '}
                    {selectedResume.parsed_data?.phone || 'No phone detected'}
                  </p>
                </div>

                <button
                  onClick={() => onSelectForMatch(selectedResume.id)}
                  className="glow-btn px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
                >
                  <Target className="w-4 h-4" />
                  <span>Analyze Against Job</span>
                </button>
              </div>

              {/* Scanned Warning If Applicable */}
              {selectedResume.is_scanned && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Scanned or Image-Based PDF Detected</h5>
                    <p className="mt-1 text-slate-300">
                      Text extraction yielded minimal characters because this document appears to be a scanned image.
                      For best matching accuracy, please upload a digital text PDF, DOCX, or run OCR.
                    </p>
                  </div>
                </div>
              )}

              {/* Overview Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Experience
                  </div>
                  <div className="text-lg font-bold text-purple-400 mt-0.5">
                    {selectedResume.parsed_data?.experience_years?.toFixed(1) || '0.0'} Yrs
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Education Level
                  </div>
                  <div className="text-sm font-bold text-cyan-400 mt-1 line-clamp-1">
                    {selectedResume.parsed_data?.education_level || "Bachelor's Degree"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Skills Detected
                  </div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {selectedResume.parsed_data?.skills?.length || 0} Competencies
                  </div>
                </div>
              </div>

              {/* Extracted Skills Badges */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Extracted Technical Skills
                </h4>
                {selectedResume.parsed_data?.skills && selectedResume.parsed_data.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedResume.parsed_data.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950/40 text-purple-300 border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No standardized technical skills identified.</p>
                )}
              </div>

              {/* Links */}
              {selectedResume.parsed_data?.links && selectedResume.parsed_data.links.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Profile Links
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.parsed_data.links.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 text-cyan-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {selectedResume.parsed_data?.summary && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Candidate Summary
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                    {selectedResume.parsed_data.summary}
                  </p>
                </div>
              )}

              {/* Raw Text Accordion */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRawText(!showRawText)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1"
                >
                  <span>View Extracted Raw Text</span>
                  {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showRawText && (
                  <pre className="mt-3 p-4 rounded-xl bg-slate-950 text-slate-400 text-xs font-mono max-h-60 overflow-y-auto whitespace-pre-wrap border border-slate-800">
                    {/* Access raw_text if present */}
                    {(selectedResume as any).raw_text || 'Raw text preview unavailable.'}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl border-slate-800">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">Select a resume to inspect details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
