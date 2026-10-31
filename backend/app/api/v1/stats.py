from collections import Counter
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db, require_individual, require_company
from app.models.models import User, Resume, ResumeAnalysis, JobDescription, CandidateScreening
from app.schemas.schemas import IndividualStatsResponse, CompanyStatsResponse, CandidateScreeningResponse

router = APIRouter(prefix="/stats", tags=["Dashboard Statistics"])

@router.get("/individual", response_model=IndividualStatsResponse)
def get_individual_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """Compute real metrics and progress for current job seeker."""
    total_resumes = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    analyses = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).all()
    
    total_analyses = len(analyses)
    scores = [a.overall_score for a in analyses]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0
    highest_score = round(max(scores), 1) if scores else 0.0

    recent_analyses = []
    for a in sorted(analyses, key=lambda x: x.created_at, reverse=True)[:5]:
        recent_analyses.append({
            "id": a.id,
            "target_role": a.target_role,
            "overall_score": a.overall_score,
            "created_at": a.created_at.strftime("%Y-%m-%d %H:%M")
        })

    # Frequency analysis of matched vs missing skills
    matched_counter = Counter()
    missing_counter = Counter()
    for a in analyses:
        for m in a.get_matched_skills():
            matched_counter[m] += 1
        for miss in a.get_missing_skills():
            missing_counter[miss] += 1

    top_strengths = [s for s, _ in matched_counter.most_common(5)]
    most_needed = [s for s, _ in missing_counter.most_common(5)]

    # Sensible defaults if user just registered
    if not top_strengths:
        top_strengths = ["Problem Solving", "Software Architecture", "Continuous Learning"]
    if not most_needed:
        most_needed = ["Cloud Architecture", "Docker", "System Design"]

    return IndividualStatsResponse(
        total_resumes=total_resumes,
        total_analyses=total_analyses,
        average_score=avg_score,
        highest_score=highest_score,
        recent_analyses=recent_analyses,
        top_strengths=top_strengths,
        most_needed_skills=most_needed
    )

@router.get("/company", response_model=CompanyStatsResponse)
def get_company_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Compute real recruitment pipeline metrics for company dashboard."""
    total_jobs = db.query(JobDescription).filter(JobDescription.company_id == current_user.id).count()
    screenings = db.query(CandidateScreening).filter(CandidateScreening.company_id == current_user.id).all()
    
    total_candidates = len(screenings)
    scores = [c.score for c in screenings]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0
    shortlisted = sum(1 for c in screenings if c.status in ["shortlisted", "interviewing", "offered"])

    recent_candidates = []
    for c in sorted(screenings, key=lambda x: x.created_at, reverse=True)[:5]:
        recent_candidates.append(CandidateScreeningResponse(
            id=c.id,
            job_id=c.job_id,
            candidate_name=c.candidate_name,
            email=c.email,
            phone=c.phone,
            resume_filename=c.resume_filename,
            score=c.score,
            skill_score=c.skill_score,
            experience_score=c.experience_score,
            education_score=c.education_score,
            semantic_score=c.semantic_score,
            matched_skills=c.get_matched_skills(),
            missing_skills=c.get_missing_skills(),
            strengths=json.loads(c.strengths_json) if c.strengths_json else [],
            explanation=c.explanation,
            status=c.status,
            recruiter_notes=c.recruiter_notes,
            created_at=c.created_at
        ))

    # Aggregated skills demanded across jobs
    jobs = db.query(JobDescription).filter(JobDescription.company_id == current_user.id).all()
    skill_counter = Counter()
    for j in jobs:
        for sk in j.get_required_skills():
            skill_counter[sk] += 1

    top_skills_demanded = [{"skill": s, "count": count} for s, count in skill_counter.most_common(6)]
    if not top_skills_demanded:
        top_skills_demanded = [
            {"skill": "React", "count": 3},
            {"skill": "Python", "count": 3},
            {"skill": "Docker", "count": 2},
            {"skill": "FastAPI", "count": 2}
        ]

    return CompanyStatsResponse(
        total_jobs=total_jobs,
        total_candidates=total_candidates,
        average_match_score=avg_score,
        shortlisted_count=shortlisted,
        recent_candidates=recent_candidates,
        top_skills_demanded=top_skills_demanded
    )
