import os
import json
import uuid
import aiofiles
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_individual
from app.core.config import settings
from app.models.models import User, Resume, ParsedResumeData, JobDescription, ResumeAnalysis, SkillGapReport
from app.schemas.schemas import (
    ResumeResponse, ParsedResumeDataResponse, AnalysisRequest,
    ResumeAnalysisResponse, SkillGapDetail
)
from app.services.parser import parse_resume
from app.services.matcher import match_resume_to_job
from app.services.skill_gap import analyze_skill_gaps

router = APIRouter(prefix="/individual", tags=["Individual Portal"])

@router.post("/resumes/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """Upload and parse a candidate resume in PDF, DOCX, or TXT format."""
    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed extensions: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Stream write and check size
    file_size = 0
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    async with aiofiles.open(file_path, "wb") as out_file:
        while content := await file.read(1024 * 1024):  # 1MB chunk
            file_size += len(content)
            if file_size > max_bytes:
                await out_file.close()
                if os.path.exists(file_path):
                    os.remove(file_path)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
                )
            await out_file.write(content)

    # Parse resume
    parsed_info = parse_resume(file_path)

    # Save Resume Record
    db_resume = Resume(
        user_id=current_user.id,
        filename=unique_filename,
        original_filename=file.filename,
        file_path=file_path,
        file_type=ext.replace(".", ""),
        file_size_bytes=file_size,
        raw_text=parsed_info.get("raw_text", ""),
        is_scanned=parsed_info.get("is_scanned", False)
    )
    db.add(db_resume)
    db.flush()

    # Save Parsed Data
    parsed_data = ParsedResumeData(
        resume_id=db_resume.id,
        candidate_name=parsed_info.get("candidate_name") or current_user.full_name,
        email=parsed_info.get("email") or current_user.email,
        phone=parsed_info.get("phone", ""),
        links_json=json.dumps(parsed_info.get("links", [])),
        skills_json=json.dumps(parsed_info.get("skills", [])),
        experience_years=parsed_info.get("experience_years", 0.0),
        experience_details_json=json.dumps(parsed_info.get("experience_details", [])),
        education_level=parsed_info.get("education_level", "Bachelor's Degree"),
        education_details_json=json.dumps(parsed_info.get("education_details", [])),
        projects_json=json.dumps(parsed_info.get("projects", [])),
        summary=parsed_info.get("summary", "")
    )
    db.add(parsed_data)
    db.commit()
    db.refresh(db_resume)

    return _format_resume_response(db_resume)

@router.get("/resumes", response_model=List[ResumeResponse])
def get_user_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """Retrieve all uploaded resumes for the current individual."""
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    return [_format_resume_response(r) for r in resumes]

@router.get("/resumes/{resume_id}", response_model=ResumeResponse)
def get_resume_by_id(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """Retrieve details for a specific resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
    return _format_resume_response(resume)

@router.delete("/resumes/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """Delete a user resume."""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
    
    if os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception:
            pass

    db.delete(resume)
    db.commit()
    return None

@router.post("/analyze", response_model=ResumeAnalysisResponse)
def run_resume_analysis(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """
    Compare selected resume against a job description, computing multi-dimensional compatibility
    scores, identifying skill gaps, and generating personalized learning roadmaps & projects.
    """
    resume = db.query(Resume).filter(Resume.id == request.resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected resume not found.")

    if not resume.parsed_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume has not been parsed properly.")

    # Build resume dictionary
    resume_dict = {
        "candidate_name": resume.parsed_data.candidate_name,
        "email": resume.parsed_data.email,
        "phone": resume.parsed_data.phone,
        "skills": resume.parsed_data.get_skills(),
        "experience_years": resume.parsed_data.experience_years,
        "education_level": resume.parsed_data.education_level,
        "raw_text": resume.raw_text or ""
    }

    # Retrieve or construct job details
    job_dict = {}
    target_role = request.target_role or "Target Role"
    if request.job_id:
        job = db.query(JobDescription).filter(JobDescription.id == request.job_id).first()
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified job not found.")
        job_dict = {
            "title": job.title,
            "description": job.description,
            "min_years_experience": job.min_years_experience,
            "required_skills": job.get_required_skills(),
            "preferred_skills": job.get_preferred_skills()
        }
        target_role = job.title
    elif request.job_description_text:
        job_dict = {
            "title": target_role,
            "description": request.job_description_text,
            "min_years_experience": 2.0,
            "required_skills": [],
            "preferred_skills": []
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either a job_id or job_description_text must be provided for matching."
        )

    # Run AI Matching Engine
    match_result = match_resume_to_job(resume_dict, job_dict)

    # Save Analysis in Database
    analysis = ResumeAnalysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_id=request.job_id,
        target_role=target_role,
        job_description_text=job_dict.get("description", ""),
        overall_score=match_result["overall_score"],
        skill_score=match_result["skill_score"],
        experience_score=match_result["experience_score"],
        education_score=match_result["education_score"],
        semantic_score=match_result["semantic_score"],
        matched_skills_json=json.dumps(match_result["matched_skills"]),
        missing_skills_json=json.dumps(match_result["missing_skills"]),
        partial_skills_json=json.dumps(match_result["partial_skills"]),
        strengths_json=json.dumps(match_result["strengths"]),
        weaknesses_json=json.dumps(match_result["weaknesses"]),
        explanation=match_result["explanation"]
    )
    db.add(analysis)
    db.flush()

    # Generate Skill Gap and Personalized Learning Recommendations
    gap_data = analyze_skill_gaps(
        missing_skills=match_result["missing_skills"],
        job_required_skills=job_dict.get("required_skills", []),
        job_preferred_skills=job_dict.get("preferred_skills", []),
        target_role=target_role
    )

    gap_report = SkillGapReport(
        analysis_id=analysis.id,
        critical_gaps_json=json.dumps(gap_data["critical_skills"]),
        important_gaps_json=json.dumps(gap_data["important_skills"]),
        additional_gaps_json=json.dumps(gap_data["additional_skills"]),
        roadmap_json=json.dumps(gap_data["learning_path"]),
        recommendations_json=json.dumps(gap_data["resources_by_skill"]),
        projects_json=json.dumps(gap_data["projects"])
    )
    db.add(gap_report)
    db.commit()
    db.refresh(analysis)

    return _format_analysis_response(analysis, gap_data)

@router.get("/analyses", response_model=List[ResumeAnalysisResponse])
def get_user_analyses(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """Retrieve history of all resume match analyses conducted by current user."""
    analyses = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).order_by(ResumeAnalysis.created_at.desc()).all()
    return [_format_analysis_response(a) for a in analyses]

@router.get("/analyses/{analysis_id}", response_model=ResumeAnalysisResponse)
def get_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_individual)
):
    """Retrieve full analysis report including gap analysis and learning recommendations."""
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id, ResumeAnalysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found.")
    return _format_analysis_response(analysis)

def _format_resume_response(resume: Resume) -> ResumeResponse:
    parsed = None
    if resume.parsed_data:
        p = resume.parsed_data
        parsed = ParsedResumeDataResponse(
            id=p.id,
            candidate_name=p.candidate_name,
            email=p.email,
            phone=p.phone,
            skills=p.get_skills(),
            experience_years=p.experience_years,
            education_level=p.education_level,
            links=json.loads(p.links_json) if p.links_json else [],
            summary=p.summary,
            experience_details=p.get_experience_details(),
            education_details=p.get_education_details(),
            projects=p.get_projects()
        )
    return ResumeResponse(
        id=resume.id,
        filename=resume.filename,
        original_filename=resume.original_filename,
        file_type=resume.file_type,
        file_size_bytes=resume.file_size_bytes,
        is_scanned=resume.is_scanned,
        created_at=resume.created_at,
        parsed_data=parsed
    )

def _format_analysis_response(analysis: ResumeAnalysis, gap_data: Optional[dict] = None) -> ResumeAnalysisResponse:
    gap_detail = None
    if gap_data:
        gap_detail = SkillGapDetail(**gap_data)
    elif analysis.gap_report:
        gr = analysis.gap_report
        gap_detail = SkillGapDetail(
            critical_skills=json.loads(gr.critical_gaps_json) if gr.critical_gaps_json else [],
            important_skills=json.loads(gr.important_gaps_json) if gr.important_gaps_json else [],
            additional_skills=json.loads(gr.additional_gaps_json) if gr.additional_gaps_json else [],
            resources_by_skill=json.loads(gr.recommendations_json) if gr.recommendations_json else {},
            projects=json.loads(gr.projects_json) if gr.projects_json else [],
            learning_path=json.loads(gr.roadmap_json) if gr.roadmap_json else []
        )

    return ResumeAnalysisResponse(
        id=analysis.id,
        resume_id=analysis.resume_id,
        job_id=analysis.job_id,
        target_role=analysis.target_role,
        overall_score=analysis.overall_score,
        skill_score=analysis.skill_score,
        experience_score=analysis.experience_score,
        education_score=analysis.education_score,
        semantic_score=analysis.semantic_score,
        matched_skills=analysis.get_matched_skills(),
        missing_skills=analysis.get_missing_skills(),
        partial_skills=analysis.get_partial_skills(),
        strengths=analysis.get_strengths(),
        weaknesses=analysis.get_weaknesses(),
        explanation=analysis.explanation,
        created_at=analysis.created_at,
        gap_analysis=gap_detail
    )
