from typing import List, Dict, Any
from app.services.resources_db import get_resources_for_skill, get_project_for_skills

def analyze_skill_gaps(
    missing_skills: List[str],
    job_required_skills: List[str],
    job_preferred_skills: List[str],
    target_role: str
) -> Dict[str, Any]:
    """
    Categorize missing competencies into Critical, Important, and Additional,
    and attach curated learning resources, personalized timeline roadmap,
    and practical hands-on projects.
    """
    req_set = {s.lower() for s in job_required_skills}
    pref_set = {s.lower() for s in job_preferred_skills}

    critical_gaps = []
    important_gaps = []
    additional_gaps = []

    for skill in missing_skills:
        skill_lower = skill.lower()
        if skill_lower in req_set:
            critical_gaps.append(skill)
        elif skill_lower in pref_set:
            important_gaps.append(skill)
        else:
            # First 2 default to critical/important if not tagged
            if len(critical_gaps) < 3:
                critical_gaps.append(skill)
            elif len(important_gaps) < 3:
                important_gaps.append(skill)
            else:
                additional_gaps.append(skill)

    # Compile verified learning resources for missing skills
    resources_by_skill = {}
    skills_to_lookup = (critical_gaps + important_gaps)[:5]
    for skill in skills_to_lookup:
        resources = get_resources_for_skill(skill)
        resources_by_skill[skill] = resources

    # Generate practical portfolio project ideas tailored to the missing skills
    recommended_projects = get_project_for_skills(critical_gaps + important_gaps)

    # Generate personalized timeline roadmap
    roadmap = [
        {
            "phase": "Phase 1: Foundations & Core Deficits",
            "timeline": "Weeks 1 - 2",
            "focus_skills": critical_gaps[:2] if critical_gaps else ["Core Architecture & Testing"],
            "milestone": "Master syntax, fundamentals, and complete interactive documentation tutorials.",
            "deliverable": "Mini-project demonstrating basic RESTful or component architecture."
        },
        {
            "phase": "Phase 2: Deep Dive & Integration",
            "timeline": "Weeks 3 - 4",
            "focus_skills": (critical_gaps[2:] + important_gaps[:2]) if (critical_gaps[2:] + important_gaps[:2]) else ["Database & State Management"],
            "milestone": "Integrate persistence, caching, and third-party APIs.",
            "deliverable": "End-to-end CRUD service with unit tests and Dockerized deployment."
        },
        {
            "phase": "Phase 3: Production Polish & Capstone Project",
            "timeline": "Weeks 5 - 6",
            "focus_skills": (important_gaps[2:] + additional_gaps[:2]) if (important_gaps[2:] + additional_gaps[:2]) else ["CI/CD & Cloud Deployment"],
            "milestone": "Build capstone portfolio project with live URL, GitHub README, and CI/CD pipeline.",
            "deliverable": recommended_projects[0]["title"] if recommended_projects else "Production Portfolio Project"
        }
    ]

    return {
        "critical_skills": critical_gaps,
        "important_skills": important_gaps,
        "additional_skills": additional_gaps,
        "resources_by_skill": resources_by_skill,
        "projects": recommended_projects,
        "learning_path": roadmap
    }
