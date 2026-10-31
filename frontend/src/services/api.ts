import {
  AuthResponse,
  User,
  Resume,
  JobDescription,
  ResumeAnalysis,
  CandidateScreening,
  IndividualStats,
  CompanyStats,
  SkillGapDetail
} from '../types';

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('talentloop_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await res.json();
      errorMsg = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      errorMsg = res.statusText || `Request failed with code ${res.status}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // ---------------- AUTH ----------------
  async register(data: { email: string; password: string; full_name: string; role: string; company_name?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error('Cannot reach the TalentLoop API. Start the FastAPI backend on port 8000 and make sure the frontend proxy is running.');
    }
    return handleResponse<AuthResponse>(res);
  },

  async getCurrentUser(accessToken?: string): Promise<User> {
    const authHeader = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : getAuthHeader();
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeader,
    });
    return handleResponse<User>(res);
  },

  // ---------------- INDIVIDUAL ----------------
  async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/individual/resumes/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse<Resume>(res);
  },

  async getResumes(): Promise<Resume[]> {
    const res = await fetch(`${API_BASE}/individual/resumes`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Resume[]>(res);
  },

  async deleteResume(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/individual/resumes/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete resume');
  },

  async runAnalysis(payload: {
    resume_id: number;
    job_id?: number;
    target_role?: string;
    job_description_text?: string;
  }): Promise<ResumeAnalysis> {
    const res = await fetch(`${API_BASE}/individual/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<ResumeAnalysis>(res);
  },

  async getAnalyses(): Promise<ResumeAnalysis[]> {
    const res = await fetch(`${API_BASE}/individual/analyses`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<ResumeAnalysis[]>(res);
  },

  async getAnalysisById(id: number): Promise<ResumeAnalysis> {
    const res = await fetch(`${API_BASE}/individual/analyses/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<ResumeAnalysis>(res);
  },

  async getIndividualStats(): Promise<IndividualStats> {
    const res = await fetch(`${API_BASE}/stats/individual`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<IndividualStats>(res);
  },

  // ---------------- COMPANY ----------------
  async createJob(jobData: {
    title: string;
    department?: string;
    location?: string;
    employment_type?: string;
    experience_level?: string;
    min_years_experience: number;
    description: string;
    responsibilities?: string;
    qualifications?: string;
    required_skills: string[];
    preferred_skills: string[];
  }): Promise<JobDescription> {
    const res = await fetch(`${API_BASE}/company/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(jobData),
    });
    return handleResponse<JobDescription>(res);
  },

  async getJobs(): Promise<JobDescription[]> {
    const res = await fetch(`${API_BASE}/company/jobs`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<JobDescription[]>(res);
  },

  async getJobById(id: number): Promise<JobDescription> {
    const res = await fetch(`${API_BASE}/company/jobs/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<JobDescription>(res);
  },

  async updateJob(id: number, jobData: any): Promise<JobDescription> {
    const res = await fetch(`${API_BASE}/company/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(jobData),
    });
    return handleResponse<JobDescription>(res);
  },

  async deleteJob(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/company/jobs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete job');
  },

  async bulkScreenResumes(jobId: number, files: File[]): Promise<CandidateScreening[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const res = await fetch(`${API_BASE}/company/screenings/bulk-upload?job_id=${jobId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse<CandidateScreening[]>(res);
  },

  async getLeaderboard(
    jobId: number,
    params?: { min_score?: number; skill_filter?: string; status_filter?: string; search?: string }
  ): Promise<CandidateScreening[]> {
    const query = new URLSearchParams();
    if (params?.min_score !== undefined) query.set('min_score', params.min_score.toString());
    if (params?.skill_filter) query.set('skill_filter', params.skill_filter);
    if (params?.status_filter) query.set('status_filter', params.status_filter);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/company/screenings/leaderboard/${jobId}?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<CandidateScreening[]>(res);
  },

  async compareCandidates(candidateIds: number[]): Promise<{
    job_title: string;
    job_required_skills: string[];
    candidates: CandidateScreening[];
  }> {
    const query = candidateIds.map((id) => `candidate_ids=${id}`).join('&');
    const res = await fetch(`${API_BASE}/company/screenings/compare?${query}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any>(res);
  },

  async updateCandidateStatus(
    screeningId: number,
    status: string,
    recruiter_notes?: string
  ): Promise<CandidateScreening> {
    const res = await fetch(`${API_BASE}/company/screenings/${screeningId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, recruiter_notes }),
    });
    return handleResponse<CandidateScreening>(res);
  },

  async getCandidateDetail(screeningId: number): Promise<CandidateScreening> {
    const res = await fetch(`${API_BASE}/company/screenings/${screeningId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<CandidateScreening>(res);
  },

  exportCSVUrl(jobId: number): string {
    return `${API_BASE}/company/screenings/export/${jobId}`;
  },

  async getCompanyStats(): Promise<CompanyStats> {
    const res = await fetch(`${API_BASE}/stats/company`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<CompanyStats>(res);
  },
};
