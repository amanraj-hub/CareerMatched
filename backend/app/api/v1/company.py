import os
import io
import csv
import json
import uuid
import aiofiles
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_company, get_current_user
from app.core.config import settings
from app.models.models import User, JobDescription, CandidateScreening
from app.schemas.schemas import (
    JobCreate, JobResponse, CandidateScreeningResponse,
    CandidateStatusUpdate, CandidateComparisonResponse
)
from app.services.parser import parse_resume
from app.services.matcher import match_resume_to_job

router = APIRouter(prefix="/company", tags=["Company Portal"])

# ----------------- JOB DESCRIPTIONS MANAGEMENT -----------------

@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Create a new job description with required skills and criteria."""
    new_job = JobDescription(
        company_id=current_user.id,
        title=job_in.title,
        department=job_in.department,
        location=job_in.location,
        employment_type=job_in.employment_type,
        experience_level=job_in.experience_level,
        min_years_experience=job_in.min_years_experience,
        description=job_in.description,
        responsibilities=job_in.responsibilities,
        qualifications=job_in.qualifications,
        required_skills_json=json.dumps(job_in.required_skills),
        preferred_skills_json=json.dumps(job_in.preferred_skills),
        is_active=True
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return _format_job_response(new_job)

@router.get("/jobs", response_model=List[JobResponse])
def list_company_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List jobs. If company, returns company's jobs. If individual, returns all active jobs."""
    if current_user.role == "company":
        jobs = db.query(JobDescription).filter(JobDescription.company_id == current_user.id).order_by(JobDescription.created_at.desc()).all()
    else:
        jobs = db.query(JobDescription).filter(JobDescription.is_active == True).order_by(JobDescription.created_at.desc()).all()
    return [_format_job_response(j) for j in jobs]

@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a specific job."""
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found.")
    return _format_job_response(job)

@router.put("/jobs/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Update an existing job description."""
    job = db.query(JobDescription).filter(JobDescription.id == job_id, JobDescription.company_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found.")

    job.title = job_in.title
    job.department = job_in.department
    job.location = job_in.location
    job.employment_type = job_in.employment_type
    job.experience_level = job_in.experience_level
    job.min_years_experience = job_in.min_years_experience
    job.description = job_in.description
    job.responsibilities = job_in.responsibilities
    job.qualifications = job_in.qualifications
    job.required_skills_json = json.dumps(job_in.required_skills)
    job.preferred_skills_json = json.dumps(job_in.preferred_skills)

    db.commit()
    db.refresh(job)
    return _format_job_response(job)

@router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Delete a job description and associated screenings."""
    job = db.query(JobDescription).filter(JobDescription.id == job_id, JobDescription.company_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found.")
    db.delete(job)
    db.commit()
    return None


# ----------------- BULK RESUME SCREENING & LEADERBOARD -----------------

@router.post("/screenings/bulk-upload", response_model=List[CandidateScreeningResponse])
async def bulk_upload_and_screen_candidates(
    job_id: int = Query(..., description="Target Job ID to screen against"),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """
    Upload multiple candidate resumes simultaneously, automatically parse text,
    calculate AI compatibility score against selected job description, and rank on leaderboard.
    """
    job = db.query(JobDescription).filter(JobDescription.id == job_id, JobDescription.company_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found.")

    job_dict = {
        "title": job.title,
        "description": job.description,
        "min_years_experience": job.min_years_experience,
        "required_skills": job.get_required_skills(),
        "preferred_skills": job.get_preferred_skills()
    }

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    results = []

    for file in files:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            continue

        unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

        # Save file to disk
        async with aiofiles.open(file_path, "wb") as out:
            content = await file.read()
            await out.write(content)

        # Parse resume
        parsed = parse_resume(file_path)

        # Run AI matching engine
        match = match_resume_to_job(parsed, job_dict)

        # Save Candidate Screening
        candidate_name = parsed.get("candidate_name") or os.path.splitext(file.filename)[0].replace("_", " ").title()
        screening = CandidateScreening(
            company_id=current_user.id,
            job_id=job.id,
            candidate_name=candidate_name,
            email=parsed.get("email") or f"{candidate_name.lower().replace(' ', '.')}@email.com",
            phone=parsed.get("phone", ""),
            resume_filename=file.filename,
            score=match["overall_score"],
            skill_score=match["skill_score"],
            experience_score=match["experience_score"],
            education_score=match["education_score"],
            semantic_score=match["semantic_score"],
            matched_skills_json=json.dumps(match["matched_skills"]),
            missing_skills_json=json.dumps(match["missing_skills"]),
            strengths_json=json.dumps(match["strengths"]),
            explanation=match["explanation"],
            status="new"
        )
        db.add(screening)
        results.append(screening)

    db.commit()
    for s in results:
        db.refresh(s)

    # Sort descending by compatibility score (Leaderboard)
    results.sort(key=lambda x: x.score, reverse=True)
    return [_format_screening_response(s) for s in results]

@router.get("/screenings/leaderboard/{job_id}", response_model=List[CandidateScreeningResponse])
def get_candidate_leaderboard(
    job_id: int,
    min_score: float = Query(0.0, ge=0.0, le=100.0),
    skill_filter: Optional[str] = Query(None, description="Filter candidates possessing this skill"),
    status_filter: Optional[str] = Query(None, description="Filter by status: new, shortlisted, etc."),
    search: Optional[str] = Query(None, description="Search candidate name or email"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """
    Get ranked candidate leaderboard for a specific job with advanced filtering.
    """
    query = db.query(CandidateScreening).filter(
        CandidateScreening.job_id == job_id,
        CandidateScreening.company_id == current_user.id,
        CandidateScreening.score >= min_score
    )

    if status_filter:
        query = query.filter(CandidateScreening.status == status_filter.lower())

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (CandidateScreening.candidate_name.ilike(search_pattern)) |
            (CandidateScreening.email.ilike(search_pattern))
        )

    candidates = query.order_by(CandidateScreening.score.desc()).all()

    # Filter in-memory by skill if specified
    if skill_filter:
        sf_lower = skill_filter.lower().strip()
        filtered = []
        for cand in candidates:
            matched = [s.lower() for s in cand.get_matched_skills()]
            if sf_lower in matched or any(sf_lower in s for s in matched):
                filtered.append(cand)
        candidates = filtered

    return [_format_screening_response(c) for c in candidates]

@router.get("/screenings/compare", response_model=CandidateComparisonResponse)
def compare_candidates(
    candidate_ids: List[int] = Query(..., description="2 to 4 Candidate Screening IDs to compare"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Compare selected candidates side by side against job competencies."""
    if len(candidate_ids) < 2 or len(candidate_ids) > 4:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please select between 2 and 4 candidates to compare.")

    candidates = db.query(CandidateScreening).filter(
        CandidateScreening.id.in_(candidate_ids),
        CandidateScreening.company_id == current_user.id
    ).all()

    if not candidates:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching candidates found.")

    job = db.query(JobDescription).filter(JobDescription.id == candidates[0].job_id).first()
    job_title = job.title if job else "Target Position"
    job_required = job.get_required_skills() if job else []

    return CandidateComparisonResponse(
        job_title=job_title,
        job_required_skills=job_required,
        candidates=[_format_screening_response(c) for c in candidates]
    )

@router.get("/screenings/{screening_id}", response_model=CandidateScreeningResponse)
def get_candidate_screening_detail(
    screening_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Retrieve deep-dive analysis for a single candidate."""
    cand = db.query(CandidateScreening).filter(
        CandidateScreening.id == screening_id,
        CandidateScreening.company_id == current_user.id
    ).first()
    if not cand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found.")
    return _format_screening_response(cand)

@router.patch("/screenings/{screening_id}/status", response_model=CandidateScreeningResponse)
def update_candidate_status(
    screening_id: int,
    status_update: CandidateStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Update candidate recruitment status (shortlisted, interviewing, rejected, offered) and notes."""
    cand = db.query(CandidateScreening).filter(
        CandidateScreening.id == screening_id,
        CandidateScreening.company_id == current_user.id
    ).first()
    if not cand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found.")

    cand.status = status_update.status
    if status_update.recruiter_notes is not None:
        cand.recruiter_notes = status_update.recruiter_notes

    db.commit()
    db.refresh(cand)
    return _format_screening_response(cand)

@router.get("/screenings/export/{job_id}")
def export_screenings_csv(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company)
):
    """Export the candidate leaderboard for a job as a downloadable CSV report."""
    job = db.query(JobDescription).filter(JobDescription.id == job_id, JobDescription.company_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found.")

    candidates = db.query(CandidateScreening).filter(
        CandidateScreening.job_id == job_id,
        CandidateScreening.company_id == current_user.id
    ).order_by(CandidateScreening.score.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Rank", "Candidate Name", "Email", "Phone", "Overall Compatibility Score (%)",
        "Skill Match Score", "Experience Score", "Education Score", "Semantic Score",
        "Matched Skills", "Missing Skills", "Status", "Recruiter Notes"
    ])

    for rank, c in enumerate(candidates, start=1):
        writer.writerow([
            rank,
            c.candidate_name,
            c.email or "N/A",
            c.phone or "N/A",
            f"{c.score:.1f}%",
            f"{c.skill_score:.1f}%",
            f"{c.experience_score:.1f}%",
            f"{c.education_score:.1f}%",
            f"{c.semantic_score:.1f}%",
            ", ".join(c.get_matched_skills()),
            ", ".join(c.get_missing_skills()),
            c.status.upper(),
            c.recruiter_notes or ""
        ])

    output.seek(0)
    filename = f"TalentLoop_{job.title.replace(' ', '_')}_Leaderboard.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

def _format_job_response(job: JobDescription) -> JobResponse:
    return JobResponse(
        id=job.id,
        company_id=job.company_id,
        title=job.title,
        department=job.department,
        location=job.location,
        employment_type=job.employment_type,
        experience_level=job.experience_level,
        min_years_experience=job.min_years_experience,
        description=job.description,
        responsibilities=job.responsibilities,
        qualifications=job.qualifications,
        required_skills=job.get_required_skills(),
        preferred_skills=job.get_preferred_skills(),
        is_active=job.is_active,
        created_at=job.created_at
    )

def _format_screening_response(c: CandidateScreening) -> CandidateScreeningResponse:
    return CandidateScreeningResponse(
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
    )
