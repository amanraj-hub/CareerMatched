import json
from sqlalchemy.orm import Session
from app.models.models import User, IndividualProfile, CompanyProfile, JobDescription, CandidateScreening
from app.core.security import get_password_hash

def seed_database(db: Session):
    """Seed demo accounts, job descriptions, and candidates for immediate testing."""
    # Check if demo accounts already exist
    existing_user = db.query(User).filter(User.email == "alex@talentloop.ai").first()
    if existing_user:
        return

    # 1. Create Demo Individual User
    demo_individual = User(
        email="alex@talentloop.ai",
        hashed_password=get_password_hash("TalentLoop2026!"),
        full_name="Alex Rivera",
        role="individual"
    )
    db.add(demo_individual)
    db.flush()

    ind_profile = IndividualProfile(
        user_id=demo_individual.id,
        phone="+1 (555) 234-5678",
        bio="Passionate Full Stack Software Engineer passionate about high-performance web systems and AI applications.",
        current_title="Full Stack Software Engineer",
        target_role="Senior Full-Stack Engineer",
        years_of_experience=3.5,
        education_level="Bachelor's Degree",
        github_url="https://github.com/alexrivera-dev",
        linkedin_url="https://linkedin.com/in/alexrivera-tech"
    )
    db.add(ind_profile)

    # 2. Create Demo Company Recruiter
    demo_company = User(
        email="recruiter@techloop.io",
        hashed_password=get_password_hash("TalentLoop2026!"),
        full_name="Elena Rostova",
        role="company"
    )
    db.add(demo_company)
    db.flush()

    comp_profile = CompanyProfile(
        user_id=demo_company.id,
        company_name="TechLoop Systems",
        industry="Enterprise Software & AI",
        website="https://techloop.io",
        company_size="51-200",
        description="Leading AI infrastructure provider engineering modern recruitment and intelligence tools.",
        location="San Francisco, CA & Remote"
    )
    db.add(comp_profile)

    # 3. Create Demo Jobs
    job1 = JobDescription(
        company_id=demo_company.id,
        title="Senior Full-Stack Engineer",
        department="Platform Engineering",
        location="Remote (Global)",
        employment_type="Full-time",
        experience_level="Senior",
        min_years_experience=3.0,
        description="We are seeking an experienced Full-Stack Engineer to architect resilient web systems and APIs. You will work with React, TypeScript, FastAPI, PostgreSQL, and cloud deployments.",
        responsibilities="• Design, develop, and scale RESTful APIs and modern frontend interfaces.\n• Collaborate with product and ML teams to integrate intelligent search.\n• Maintain high unit test coverage and CI/CD pipelines.",
        qualifications="• Proven experience building production full-stack systems.\n• Strong grasp of relational database design and indexing.\n• Familiarity with Docker and containerized deployments.",
        required_skills_json=json.dumps(["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker"]),
        preferred_skills_json=json.dumps(["AWS", "Redis", "Tailwind CSS", "CI/CD"]),
        is_active=True
    )
    db.add(job1)

    job2 = JobDescription(
        company_id=demo_company.id,
        title="AI / Machine Learning Engineer",
        department="AI Research & Products",
        location="San Francisco, CA",
        employment_type="Full-time",
        experience_level="Mid-Senior",
        min_years_experience=2.0,
        description="Join our AI research team to develop NLP models, recommendation systems, and semantic matching algorithms for career intelligence.",
        responsibilities="• Train and fine-tune transformer models and sentence embeddings.\n• Build low-latency inference pipelines with FastAPI and PyTorch.\n• Measure and improve model precision, recall, and explainability.",
        qualifications="• Experience with Scikit-Learn, PyTorch, or TensorFlow.\n• Solid understanding of NLP tokenization, embeddings, and vector similarity.\n• Strong coding skills in Python.",
        required_skills_json=json.dumps(["Python", "Machine Learning", "Natural Language Processing", "PyTorch", "Scikit-Learn", "FastAPI"]),
        preferred_skills_json=json.dumps(["Docker", "PostgreSQL", "Transformers", "LLMs"]),
        is_active=True
    )
    db.add(job2)

    job3 = JobDescription(
        company_id=demo_company.id,
        title="Cloud DevOps Engineer",
        department="Infrastructure",
        location="Remote",
        employment_type="Full-time",
        experience_level="Mid-Level",
        min_years_experience=2.5,
        description="Responsible for maintaining cloud infrastructure, Kubernetes clusters, Dockerized services, and automated CI/CD release cycles.",
        responsibilities="• Deploy and maintain multi-region cloud workloads on AWS.\n• Automate container deployments using Kubernetes and Helm.\n• Build robust monitoring with Prometheus and Grafana.",
        qualifications="• Strong hands-on experience with Docker and Kubernetes.\n• Experience with Terraform or CloudFormation.\n• Solid Linux administration and scripting skills.",
        required_skills_json=json.dumps(["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"]),
        preferred_skills_json=json.dumps(["Python", "Nginx", "PostgreSQL"]),
        is_active=True
    )
    db.add(job3)
    db.flush()

    # 4. Seed initial candidate screenings for Job 1 to make the leaderboard vibrant
    candidates = [
        {
            "name": "Sarah Chen",
            "email": "sarah.chen@techmail.com",
            "phone": "+1 415-890-1122",
            "filename": "sarah_chen_fullstack_lead.pdf",
            "score": 93.5,
            "skill_score": 95.0,
            "experience_score": 92.0,
            "education_score": 95.0,
            "semantic_score": 90.0,
            "matched": ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
            "missing": ["AWS"],
            "strengths": ["Comprehensive full-stack mastery", "Strong architectural background with 4.5 years experience"],
            "status": "shortlisted",
            "notes": "Outstanding technical profile. Scheduled for round 2 technical review."
        },
        {
            "name": "Marcus Vance",
            "email": "m.vance@inbox.io",
            "phone": "+1 206-781-9943",
            "filename": "marcus_vance_senior_dev.pdf",
            "score": 87.2,
            "skill_score": 85.0,
            "experience_score": 90.0,
            "education_score": 90.0,
            "semantic_score": 84.0,
            "matched": ["React", "TypeScript", "Python", "PostgreSQL", "Docker", "AWS"],
            "missing": ["FastAPI"],
            "strengths": ["Strong cloud and database background", "Solid 3.8 years experience in SaaS"],
            "status": "interviewing",
            "notes": "Fast learner, strong React and SQL experience."
        },
        {
            "name": "Priya Sharma",
            "email": "priya.sharma@domain.net",
            "phone": "+1 650-321-4477",
            "filename": "priya_sharma_software_eng.docx",
            "score": 79.4,
            "skill_score": 75.0,
            "experience_score": 80.0,
            "education_score": 95.0,
            "semantic_score": 82.0,
            "matched": ["Python", "FastAPI", "PostgreSQL", "Docker"],
            "missing": ["React", "TypeScript"],
            "strengths": ["Excellent backend API development and database design", "Master's in Computer Science"],
            "status": "new",
            "notes": "Backend heavy candidate. Good fit if paired with frontend engineer."
        },
        {
            "name": "Liam O'Connor",
            "email": "liam.oc@devhub.com",
            "phone": "+1 617-555-8321",
            "filename": "liam_oconnor_junior.pdf",
            "score": 64.0,
            "skill_score": 60.0,
            "experience_score": 65.0,
            "education_score": 88.0,
            "semantic_score": 60.0,
            "matched": ["React", "TypeScript", "Python"],
            "missing": ["FastAPI", "PostgreSQL", "Docker"],
            "strengths": ["Strong frontend JavaScript/React skills", "Eager fresher profile"],
            "status": "new",
            "notes": "Good potential for junior role or internship."
        }
    ]

    for cand in candidates:
        screening = CandidateScreening(
            company_id=demo_company.id,
            job_id=job1.id,
            candidate_name=cand["name"],
            email=cand["email"],
            phone=cand["phone"],
            resume_filename=cand["filename"],
            score=cand["score"],
            skill_score=cand["skill_score"],
            experience_score=cand["experience_score"],
            education_score=cand["education_score"],
            semantic_score=cand["semantic_score"],
            matched_skills_json=json.dumps(cand["matched"]),
            missing_skills_json=json.dumps(cand["missing"]),
            strengths_json=json.dumps(cand["strengths"]),
            explanation=f"Overall compatibility of {cand['score']}%. Matched core technologies: {', '.join(cand['matched'][:4])}.",
            status=cand["status"],
            recruiter_notes=cand["notes"]
        )
        db.add(screening)

    db.commit()
