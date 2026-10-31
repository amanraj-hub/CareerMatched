import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="individual")  # "individual" or "company"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    individual_profile = relationship("IndividualProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company_profile = relationship("CompanyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")
    job_descriptions = relationship("JobDescription", back_populates="company", cascade="all, delete-orphan")
    screenings = relationship("CandidateScreening", back_populates="company", cascade="all, delete-orphan")


class IndividualProfile(Base):
    __tablename__ = "individual_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    phone = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    current_title = Column(String(255), nullable=True)
    target_role = Column(String(255), nullable=True)
    years_of_experience = Column(Float, default=0.0)
    education_level = Column(String(100), nullable=True)
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)

    user = relationship("User", back_populates="individual_profile")


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    company_size = Column(String(50), nullable=True)  # e.g., "1-10", "11-50", "51-200", "201-1000", "1000+"
    description = Column(Text, nullable=True)
    logo_url = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)

    user = relationship("User", back_populates="company_profile")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, docx, txt
    file_size_bytes = Column(Integer, default=0)
    raw_text = Column(Text, nullable=True)
    is_scanned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    parsed_data = relationship("ParsedResumeData", back_populates="resume", uselist=False, cascade="all, delete-orphan")
    analyses = relationship("ResumeAnalysis", back_populates="resume", cascade="all, delete-orphan")


class ParsedResumeData(Base):
    __tablename__ = "parsed_resume_data"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False)
    candidate_name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    links_json = Column(Text, default="[]")  # List of URLs (github, linkedin, etc.)
    skills_json = Column(Text, default="[]")  # List of detected skills
    experience_years = Column(Float, default=0.0)
    experience_details_json = Column(Text, default="[]")  # parsed work experience entries
    education_level = Column(String(100), nullable=True)
    education_details_json = Column(Text, default="[]")  # parsed degrees/universities
    projects_json = Column(Text, default="[]")  # parsed projects
    certifications_json = Column(Text, default="[]")
    summary = Column(Text, nullable=True)

    resume = relationship("Resume", back_populates="parsed_data")

    # Helper getters/setters for JSON fields
    def get_skills(self):
        try:
            return json.loads(self.skills_json) if self.skills_json else []
        except Exception:
            return []

    def set_skills(self, skills: list):
        self.skills_json = json.dumps(skills)

    def get_experience_details(self):
        try:
            return json.loads(self.experience_details_json) if self.experience_details_json else []
        except Exception:
            return []

    def get_education_details(self):
        try:
            return json.loads(self.education_details_json) if self.education_details_json else []
        except Exception:
            return []

    def get_projects(self):
        try:
            return json.loads(self.projects_json) if self.projects_json else []
        except Exception:
            return []


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    location = Column(String(100), nullable=True)  # "Remote", "Hybrid", "San Francisco, CA"
    employment_type = Column(String(50), default="Full-time")  # Full-time, Internship, Contract
    experience_level = Column(String(50), default="Mid-Level")  # Entry-level, Mid-level, Senior
    min_years_experience = Column(Float, default=0.0)
    description = Column(Text, nullable=False)
    responsibilities = Column(Text, nullable=True)
    qualifications = Column(Text, nullable=True)
    required_skills_json = Column(Text, default="[]")
    preferred_skills_json = Column(Text, default="[]")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("User", back_populates="job_descriptions")
    analyses = relationship("ResumeAnalysis", back_populates="job", cascade="all, delete-orphan")
    screenings = relationship("CandidateScreening", back_populates="job", cascade="all, delete-orphan")

    def get_required_skills(self):
        try:
            return json.loads(self.required_skills_json) if self.required_skills_json else []
        except Exception:
            return []

    def get_preferred_skills(self):
        try:
            return json.loads(self.preferred_skills_json) if self.preferred_skills_json else []
        except Exception:
            return []


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(255), nullable=False)
    job_description_text = Column(Text, nullable=True)
    
    # Explainable AI Compatibility Scores (0-100)
    overall_score = Column(Float, nullable=False)
    skill_score = Column(Float, nullable=False)
    experience_score = Column(Float, nullable=False)
    education_score = Column(Float, nullable=False)
    semantic_score = Column(Float, nullable=False)

    # Detailed Skill Breakdown
    matched_skills_json = Column(Text, default="[]")
    missing_skills_json = Column(Text, default="[]")
    partial_skills_json = Column(Text, default="[]")

    # Insights & Explanations
    strengths_json = Column(Text, default="[]")
    weaknesses_json = Column(Text, default="[]")
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analyses")
    resume = relationship("Resume", back_populates="analyses")
    job = relationship("JobDescription", back_populates="analyses")
    gap_report = relationship("SkillGapReport", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

    def get_matched_skills(self):
        try:
            return json.loads(self.matched_skills_json) if self.matched_skills_json else []
        except Exception:
            return []

    def get_missing_skills(self):
        try:
            return json.loads(self.missing_skills_json) if self.missing_skills_json else []
        except Exception:
            return []

    def get_partial_skills(self):
        try:
            return json.loads(self.partial_skills_json) if self.partial_skills_json else []
        except Exception:
            return []

    def get_strengths(self):
        try:
            return json.loads(self.strengths_json) if self.strengths_json else []
        except Exception:
            return []

    def get_weaknesses(self):
        try:
            return json.loads(self.weaknesses_json) if self.weaknesses_json else []
        except Exception:
            return []


class SkillGapReport(Base):
    __tablename__ = "skill_gap_reports"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("resume_analyses.id", ondelete="CASCADE"), unique=True, nullable=False)
    critical_gaps_json = Column(Text, default="[]")   # High priority skills missing
    important_gaps_json = Column(Text, default="[]")  # Medium priority skills missing
    additional_gaps_json = Column(Text, default="[]") # Nice-to-have skills
    roadmap_json = Column(Text, default="[]")         # Step-by-step career pathway
    recommendations_json = Column(Text, default="[]") # Curated courses and tutorials
    projects_json = Column(Text, default="[]")        # Practical real-world project recommendations
    created_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("ResumeAnalysis", back_populates="gap_report")


class CandidateScreening(Base):
    __tablename__ = "candidate_screenings"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    candidate_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    resume_filename = Column(String(255), nullable=False)
    
    # Scores
    score = Column(Float, nullable=False)  # Overall match score 0-100
    skill_score = Column(Float, default=0.0)
    experience_score = Column(Float, default=0.0)
    education_score = Column(Float, default=0.0)
    semantic_score = Column(Float, default=0.0)

    # Skills Breakdown
    matched_skills_json = Column(Text, default="[]")
    missing_skills_json = Column(Text, default="[]")
    strengths_json = Column(Text, default="[]")
    explanation = Column(Text, nullable=True)
    
    # Status: "new", "shortlisted", "interviewing", "rejected", "offered"
    status = Column(String(50), default="new")
    recruiter_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("User", back_populates="screenings")
    job = relationship("JobDescription", back_populates="screenings")

    def get_matched_skills(self):
        try:
            return json.loads(self.matched_skills_json) if self.matched_skills_json else []
        except Exception:
            return []

    def get_missing_skills(self):
        try:
            return json.loads(self.missing_skills_json) if self.missing_skills_json else []
        except Exception:
            return []
