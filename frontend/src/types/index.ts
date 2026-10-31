export type UserRole = 'individual' | 'company';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  individual_profile?: IndividualProfile;
  company_profile?: CompanyProfile;
}

export interface IndividualProfile {
  phone?: string;
  bio?: string;
  current_title?: string;
  target_role?: string;
  years_of_experience: number;
  education_level?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
}

export interface CompanyProfile {
  company_name: string;
  industry?: string;
  website?: string;
  company_size?: string;
  description?: string;
  location?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface ParsedResumeData {
  id: number;
  candidate_name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience_years: number;
  education_level?: string;
  links: string[];
  summary?: string;
  experience_details: any[];
  education_details: any[];
  projects: any[];
}

export interface Resume {
  id: number;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size_bytes: number;
  is_scanned: boolean;
  created_at: string;
  parsed_data?: ParsedResumeData;
}

export interface JobDescription {
  id: number;
  company_id: number;
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
  is_active: boolean;
  created_at: string;
}

export interface LearningResource {
  title: string;
  platform: string;
  url: string;
  type: string;
  difficulty: string;
  duration: string;
  description: string;
}

export interface ProjectRecommendation {
  title: string;
  difficulty: string;
  tech_stack: string[];
  overview: string;
  key_features: string[];
  learning_outcomes: string[];
}

export interface RoadmapPhase {
  phase: string;
  timeline: string;
  focus_skills: string[];
  milestone: string;
  deliverable: string;
}

export interface SkillGapDetail {
  critical_skills: string[];
  important_skills: string[];
  additional_skills: string[];
  resources_by_skill: Record<string, LearningResource[]>;
  projects: ProjectRecommendation[];
  learning_path: RoadmapPhase[];
}

export interface ResumeAnalysis {
  id: number;
  resume_id: number;
  job_id?: number;
  target_role: string;
  overall_score: number;
  skill_score: number;
  experience_score: number;
  education_score: number;
  semantic_score: number;
  matched_skills: string[];
  missing_skills: string[];
  partial_skills: string[];
  strengths: string[];
  weaknesses: string[];
  explanation: string;
  created_at: string;
  gap_analysis?: SkillGapDetail;
}

export interface CandidateScreening {
  id: number;
  job_id: number;
  candidate_name: string;
  email?: string;
  phone?: string;
  resume_filename: string;
  score: number;
  skill_score: number;
  experience_score: number;
  education_score: number;
  semantic_score: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  explanation?: string;
  status: 'new' | 'shortlisted' | 'interviewing' | 'rejected' | 'offered';
  recruiter_notes?: string;
  created_at: string;
}

export interface IndividualStats {
  total_resumes: number;
  total_analyses: number;
  average_score: number;
  highest_score: number;
  recent_analyses: {
    id: number;
    target_role: string;
    overall_score: number;
    created_at: string;
  }[];
  top_strengths: string[];
  most_needed_skills: string[];
}

export interface CompanyStats {
  total_jobs: number;
  total_candidates: number;
  average_match_score: number;
  shortlisted_count: number;
  recent_candidates: CandidateScreening[];
  top_skills_demanded: {
    skill: string;
    count: number;
  }[];
}
