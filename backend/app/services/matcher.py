import re
from typing import Dict, Any, List, Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.services.parser import extract_skills_from_text

# Related skill aliases for intelligent fuzzy/synonym matching
SKILL_ALIASES = {
    "React": ["React.js", "Reactjs", "React Native", "Next.js"],
    "Node.js": ["Node", "Nodejs", "Express.js", "Express"],
    "TypeScript": ["JavaScript", "TS", "Type Script"],
    "Python": ["FastAPI", "Django", "Flask", "PyTorch"],
    "PostgreSQL": ["Postgres", "SQL", "Relational Database", "RDBMS"],
    "AWS": ["Amazon Web Services", "Cloud", "EC2", "S3"],
    "Docker": ["Containerization", "Kubernetes", "DevOps"],
    "Machine Learning": ["ML", "Data Science", "Scikit-Learn", "Deep Learning"],
    "Natural Language Processing": ["NLP", "Transformers", "LLMs"],
}

def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """Calculate semantic similarity between resume and job description using TF-IDF and Cosine Similarity."""
    if not text1.strip() or not text2.strip():
        return 50.0

    try:
        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            sublinear_tf=True,
            max_features=5000
        )
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        # Rescale similarity into realistic compatibility distribution (e.g. 0.15 - 0.75 maps to 40 - 95%)
        scaled_score = min(98.0, max(25.0, (float(sim) * 1.5) * 100))
        return round(scaled_score, 1)
    except Exception:
        # Fallback word-overlap Jaccard similarity if TF-IDF matrix is degenerate
        tokens1 = set(re.findall(r'\b[a-zA-Z]{3,}\b', text1.lower()))
        tokens2 = set(re.findall(r'\b[a-zA-Z]{3,}\b', text2.lower()))
        if not tokens1 or not tokens2:
            return 50.0
        jaccard = len(tokens1.intersection(tokens2)) / len(tokens1.union(tokens2))
        return round(min(95.0, max(30.0, jaccard * 250)), 1)

def match_skills(
    candidate_skills: List[str],
    job_required: List[str],
    job_preferred: List[str]
) -> Tuple[List[str], List[str], List[str], float]:
    """
    Categorize skills into matched, missing, and partial, and calculate skill match score.
    """
    candidate_set = {s.lower() for s in candidate_skills}
    matched = []
    partial = []
    missing = []

    total_target_skills = list(dict.fromkeys(job_required + job_preferred))
    if not total_target_skills:
        return candidate_skills[:10], [], [], 85.0

    score_acc = 0.0
    for skill in total_target_skills:
        skill_clean = skill.strip()
        skill_lower = skill_clean.lower()

        # Exact match
        if skill_lower in candidate_set or any(c == skill_lower for c in candidate_set):
            matched.append(skill_clean)
            score_acc += 1.0
            continue

        # Alias / partial match
        aliases = SKILL_ALIASES.get(skill_clean, [])
        is_partial = False
        for alias in aliases:
            if alias.lower() in candidate_set or any(alias.lower() in c for c in candidate_set):
                partial.append(f"{skill_clean} (via {alias})")
                score_acc += 0.70
                is_partial = True
                break

        if not is_partial:
            # Substring match check
            if any(skill_lower in c or c in skill_lower for c in candidate_set if len(c) > 3):
                partial.append(skill_clean)
                score_acc += 0.60
            else:
                missing.append(skill_clean)

    # Score calculation
    max_possible = len(total_target_skills)
    skill_score = (score_acc / max_possible) * 100.0 if max_possible > 0 else 80.0
    return matched, missing, partial, round(min(100.0, max(15.0, skill_score)), 1)

def calculate_experience_score(candidate_years: float, required_years: float) -> Tuple[float, str]:
    """Evaluate experience alignment transparently."""
    if required_years <= 0:
        return 95.0, f"Candidate holds {candidate_years:.1f} years of relevant experience, meeting entry/open criteria."

    ratio = candidate_years / required_years
    if ratio >= 1.0:
        score = min(100.0, 90.0 + (ratio - 1.0) * 10.0)
        expl = f"Candidate has {candidate_years:.1f} years of experience, exceeding the required {required_years:.1f} years."
    elif ratio >= 0.75:
        score = 80.0
        expl = f"Candidate has {candidate_years:.1f} years of experience, nearly matching the {required_years:.1f} years requirement."
    elif ratio >= 0.5:
        score = 65.0
        expl = f"Candidate has {candidate_years:.1f} years of experience, slightly below the {required_years:.1f} years requirement."
    else:
        score = max(30.0, ratio * 70.0)
        expl = f"Candidate has {candidate_years:.1f} years of experience, which is below the target {required_years:.1f} years."

    return round(score, 1), expl

def calculate_education_score(candidate_edu: str, job_text: str) -> Tuple[float, str]:
    """Score education level based on candidate degree and job requirements."""
    candidate_lower = candidate_edu.lower()
    requires_masters = any(k in job_text.lower() for k in ["master", "ph.d", "doctorate", "m.s."])

    if "doctorate" in candidate_lower or "ph.d" in candidate_lower:
        return 100.0, "Holds a Doctorate (Ph.D.), fulfilling advanced research qualifications."
    elif "master" in candidate_lower:
        return 96.0, "Holds a Master's degree, satisfying high academic standards."
    elif "bachelor" in candidate_lower:
        if requires_masters:
            return 80.0, "Holds a Bachelor's degree; position prefers or requires an advanced degree."
        return 90.0, "Holds a Bachelor's degree in engineering/computer science."
    elif "associate" in candidate_lower:
        return 75.0, "Holds an Associate Degree / Professional Certification."
    else:
        return 70.0, "Education level demonstrated through practical software development experience."

def match_resume_to_job(
    resume_parsed: Dict[str, Any],
    job_dict: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Transparent, multi-criteria AI matching engine.
    Calculates overall score, component scores, matched/missing skills, strengths, weaknesses,
    and a clear explanation.
    """
    candidate_skills = resume_parsed.get("skills", [])
    raw_resume_text = resume_parsed.get("raw_text", "")
    candidate_exp = float(resume_parsed.get("experience_years", 1.0))
    candidate_edu = resume_parsed.get("education_level", "Bachelor's Degree")

    job_title = job_dict.get("title", "Target Role")
    job_desc = job_dict.get("description", "")
    min_exp = float(job_dict.get("min_years_experience", 0.0))
    required_skills = job_dict.get("required_skills", [])
    preferred_skills = job_dict.get("preferred_skills", [])

    # If job has no explicit skill list, extract them automatically from description
    if not required_skills:
        extracted = extract_skills_from_text(job_desc)
        required_skills = extracted[:8]
        preferred_skills = extracted[8:14]

    # 1. Skill Match
    matched_skills, missing_skills, partial_skills, skill_score = match_skills(
        candidate_skills, required_skills, preferred_skills
    )

    # 2. Experience Match
    experience_score, exp_expl = calculate_experience_score(candidate_exp, min_exp)

    # 3. Education Match
    education_score, edu_expl = calculate_education_score(candidate_edu, job_desc)

    # 4. Semantic Similarity
    semantic_score = calculate_semantic_similarity(raw_resume_text, f"{job_title}\n{job_desc}")

    # 5. Overall Weighted Compatibility Score
    # Weights: Skills (45%), Experience (20%), Education (15%), Semantic Relevance (20%)
    overall_score = round(
        (0.45 * skill_score) +
        (0.20 * experience_score) +
        (0.15 * education_score) +
        (0.20 * semantic_score),
        1
    )
    overall_score = min(100.0, max(10.0, overall_score))

    # Identify Strengths
    strengths = []
    if len(matched_skills) >= 4:
        strengths.append(f"Strong match across core tech stack: {', '.join(matched_skills[:4])}")
    elif len(matched_skills) > 0:
        strengths.append(f"Demonstrated proficiency in {', '.join(matched_skills)}")

    if experience_score >= 85:
        strengths.append(exp_expl)

    if education_score >= 88:
        strengths.append(edu_expl)

    if semantic_score >= 70:
        strengths.append("High context alignment between resume project history and job responsibilities")

    # Identify Weaknesses / Areas for Improvement
    weaknesses = []
    if missing_skills:
        weaknesses.append(f"Missing key required skills: {', '.join(missing_skills[:5])}")

    if experience_score < 75:
        weaknesses.append(f"Experience deficit: has {candidate_exp:.1f} years vs {min_exp:.1f} years required")

    if semantic_score < 55:
        weaknesses.append("Resume could feature more direct project impact metrics related to target role")

    # Comprehensive, transparent matching explanation
    explanation = (
        f"Candidate achieved an overall compatibility score of {overall_score}%. "
        f"Technical skill alignment is {skill_score}% with {len(matched_skills)} exact matches "
        f"({', '.join(matched_skills[:5]) if matched_skills else 'none'}) "
        f"and {len(missing_skills)} skill gaps. "
        f"Experience rating is {experience_score}% ({exp_expl}). "
        f"Education rating is {education_score}% ({edu_expl}). "
        f"Semantic document similarity scored {semantic_score}%, reflecting vocabulary and duty overlap."
    )

    return {
        "overall_score": overall_score,
        "skill_score": skill_score,
        "experience_score": experience_score,
        "education_score": education_score,
        "semantic_score": semantic_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "partial_skills": partial_skills,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "explanation": explanation
    }
