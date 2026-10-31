from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ----------------- AUTH & USER SCHEMAS -----------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    role: str = Field("individual", description="'individual' or 'company'")
    # Company specific optional fields
    company_name: Optional[str] = None
    industry: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

class IndividualProfileResponse(BaseModel):
    phone: Optional[str] = None
    bio: Optional[str] = None
    current_title: Optional[str] = None
    target_role: Optional[str] = None
    years_of_experience: float = 0.0
    education_level: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

    class Config:
        from_attributes = True

class CompanyProfileResponse(BaseModel):
    company_name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    company_size: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    individual_profile: Optional[IndividualProfileResponse] = None
    company_profile: Optional[CompanyProfileResponse] = None

    class Config:
        from_attributes = True


# ----------------- RESUME & PARSED DATA SCHEMAS -----------------

class ParsedResumeDataResponse(BaseModel):
    id: int
    candidate_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    experience_years: float = 0.0
    education_level: Optional[str] = None
    links: List[str] = []
    summary: Optional[str] = None
    experience_details: List[Dict[str, Any]] = []
    education_details: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class ResumeResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size_bytes: int
    is_scanned: bool
    created_at: datetime
    parsed_data: Optional[ParsedResumeDataResponse] = None

    class Config:
        from_attributes = True


# ----------------- JOB DESCRIPTION SCHEMAS -----------------

class JobCreate(BaseModel):
    title: str = Field(..., min_length=2)
    department: Optional[str] = None
    location: Optional[str] = "Remote"
    employment_type: Optional[str] = "Full-time"
    experience_level: Optional[str] = "Mid-Level"
    min_years_experience: float = 0.0
    description: str = Field(..., min_length=10)
    responsibilities: Optional[str] = None
    qualifications: Optional[str] = None
    required_skills: List[str] = []
    preferred_skills: List[str] = []

class JobResponse(BaseModel):
    id: int
    company_id: int
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    min_years_experience: float = 0.0
    description: str
    responsibilities: Optional[str] = None
    qualifications: Optional[str] = None
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ----------------- ANALYSIS & MATCHING SCHEMAS -----------------

class AnalysisRequest(BaseModel):
    resume_id: int
    job_id: Optional[int] = None
    target_role: Optional[str] = None
    job_description_text: Optional[str] = None

class LearningResource(BaseModel):
    title: str
    platform: str
    url: str
    type: str  # "course", "documentation", "tutorial", "practice"
    difficulty: str  # "Beginner", "Intermediate", "Advanced"
    duration: str
    description: str

class ProjectRecommendation(BaseModel):
    title: str
    difficulty: str
    tech_stack: List[str]
    overview: str
    key_features: List[str]
    learning_outcomes: List[str]

class SkillGapDetail(BaseModel):
    critical_skills: List[str] = []
    important_skills: List[str] = []
    additional_skills: List[str] = []
    resources_by_skill: Dict[str, List[LearningResource]] = {}
    projects: List[ProjectRecommendation] = []
    learning_path: List[Dict[str, Any]] = []

class ResumeAnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_id: Optional[int] = None
    target_role: str
    overall_score: float
    skill_score: float
    experience_score: float
    education_score: float
    semantic_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    partial_skills: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    explanation: str
    created_at: datetime
    gap_analysis: Optional[SkillGapDetail] = None

    class Config:
        from_attributes = True


# ----------------- COMPANY SCREENING SCHEMAS -----------------

class CandidateScreeningResponse(BaseModel):
    id: int
    job_id: int
    candidate_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_filename: str
    score: float
    skill_score: float
    experience_score: float
    education_score: float
    semantic_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    strengths: List[str] = []
    explanation: Optional[str] = None
    status: str
    recruiter_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CandidateStatusUpdate(BaseModel):
    status: str = Field(..., description="new, shortlisted, interviewing, rejected, offered")
    recruiter_notes: Optional[str] = None

class CandidateComparisonResponse(BaseModel):
    job_title: str
    job_required_skills: List[str]
    candidates: List[CandidateScreeningResponse]

# ----------------- DASHBOARD STATS SCHEMAS -----------------

class IndividualStatsResponse(BaseModel):
    total_resumes: int
    total_analyses: int
    average_score: float
    highest_score: float
    recent_analyses: List[Dict[str, Any]] = []
    top_strengths: List[str] = []
    most_needed_skills: List[str] = []

class CompanyStatsResponse(BaseModel):
    total_jobs: int
    total_candidates: int
    average_match_score: float
    shortlisted_count: int
    recent_candidates: List[CandidateScreeningResponse] = []
    top_skills_demanded: List[Dict[str, Any]] = []
