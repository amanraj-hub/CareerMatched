import os
import re
from typing import Dict, Any, List, Tuple
from pypdf import PdfReader
from docx import Document

# Extensive, curated skills taxonomy
SKILL_TAXONOMY = {
    # Programming Languages
    "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript",
    "java": "Java", "c++": "C++", "cpp": "C++", "c#": "C#", "csharp": "C#",
    "go": "Go", "golang": "Go", "rust": "Rust", "ruby": "Ruby", "php": "PHP",
    "swift": "Swift", "kotlin": "Kotlin", "scala": "Scala", "r": "R",
    "sql": "SQL", "bash": "Bash", "shell": "Shell", "html": "HTML",
    "html5": "HTML5", "css": "CSS", "css3": "CSS3", "dart": "Dart",

    # Frontend Technologies
    "react": "React", "react.js": "React", "reactjs": "React",
    "next.js": "Next.js", "nextjs": "Next.js", "vue": "Vue.js", "vue.js": "Vue.js",
    "angular": "Angular", "svelte": "Svelte", "tailwind": "Tailwind CSS",
    "tailwind css": "Tailwind CSS", "bootstrap": "Bootstrap", "redux": "Redux",
    "zustand": "Zustand", "webpack": "Webpack", "vite": "Vite",
    "responsive design": "Responsive Design", "sass": "Sass", "less": "Less",

    # Backend Technologies & Frameworks
    "fastapi": "FastAPI", "flask": "Flask", "django": "Django",
    "node.js": "Node.js", "nodejs": "Node.js", "node": "Node.js",
    "express": "Express.js", "express.js": "Express.js", "nest.js": "NestJS",
    "spring": "Spring Boot", "spring boot": "Spring Boot",
    "asp.net": "ASP.NET", ".net core": ".NET Core",
    "graphql": "GraphQL", "rest api": "RESTful APIs", "rest apis": "RESTful APIs",
    "restful": "RESTful APIs", "grpc": "gRPC", "microservices": "Microservices",
    "celery": "Celery", "rabbitmq": "RabbitMQ", "kafka": "Apache Kafka",

    # Databases & Caching
    "postgresql": "PostgreSQL", "postgres": "PostgreSQL", "mysql": "MySQL",
    "mongodb": "MongoDB", "redis": "Redis", "sqlite": "SQLite",
    "cassandra": "Cassandra", "dynamodb": "DynamoDB", "elasticsearch": "Elasticsearch",
    "supabase": "Supabase", "firebase": "Firebase", "neo4j": "Neo4j",
    "prisma": "Prisma ORM", "sqlalchemy": "SQLAlchemy",

    # Cloud & DevOps
    "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "aws": "AWS", "amazon web services": "AWS", "azure": "Azure",
    "gcp": "Google Cloud", "google cloud": "Google Cloud", "terraform": "Terraform",
    "ci/cd": "CI/CD", "cicd": "CI/CD", "github actions": "GitHub Actions",
    "jenkins": "Jenkins", "linux": "Linux", "git": "Git", "github": "GitHub",
    "gitlab": "GitLab", "nginx": "Nginx", "ansible": "Ansible",

    # AI, Data Science & Machine Learning
    "machine learning": "Machine Learning", "deep learning": "Deep Learning",
    "nlp": "Natural Language Processing", "natural language processing": "Natural Language Processing",
    "computer vision": "Computer Vision", "pytorch": "PyTorch", "tensorflow": "TensorFlow",
    "scikit-learn": "Scikit-Learn", "sklearn": "Scikit-Learn", "pandas": "Pandas",
    "numpy": "NumPy", "scipy": "SciPy", "transformers": "Transformers",
    "hugging face": "Hugging Face", "llm": "LLMs", "llms": "LLMs",
    "langchain": "LangChain", "rag": "RAG", "data analysis": "Data Analysis",
    "data science": "Data Science", "spark": "Apache Spark", "hadoop": "Hadoop",

    # Testing & Methodologies
    "pytest": "Pytest", "jest": "Jest", "unit testing": "Unit Testing",
    "cypress": "Cypress", "tdd": "TDD", "agile": "Agile", "scrum": "Scrum"
}

def extract_text_from_pdf(file_path: str) -> Tuple[str, bool]:
    """Extract plain text from PDF and check if it's scanned."""
    try:
        reader = PdfReader(file_path)
        text_parts = []
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text_parts.append(extracted)
        full_text = "\n".join(text_parts).strip()
        is_scanned = len(full_text) < 50 and len(reader.pages) > 0
        return full_text, is_scanned
    except Exception as e:
        return f"Error reading PDF: {str(e)}", False

def extract_text_from_docx(file_path: str) -> Tuple[str, bool]:
    """Extract text from DOCX file."""
    try:
        doc = Document(file_path)
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text.strip():
                        paragraphs.append(cell.text.strip())
        full_text = "\n".join(paragraphs).strip()
        return full_text, False
    except Exception as e:
        return f"Error reading DOCX: {str(e)}", False

def extract_text_from_file(file_path: str) -> Tuple[str, bool]:
    """Determine file extension and extract text."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    elif ext in [".txt", ".md"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read(), False
    else:
        return "", False

def extract_email(text: str) -> str:
    """Extract candidate email using regex."""
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    matches = re.findall(email_pattern, text)
    if matches:
        return matches[0].strip()
    return ""

def extract_phone(text: str) -> str:
    """Extract candidate phone number."""
    phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    matches = re.findall(phone_pattern, text)
    if matches:
        return matches[0].strip()
    return ""

def extract_links(text: str) -> List[str]:
    """Extract social and code profile links (LinkedIn, GitHub, Portfolio)."""
    links = []
    github_matches = re.findall(r'(https?://(?:www\.)?github\.com/[a-zA-Z0-9_-]+)', text, re.IGNORECASE)
    linkedin_matches = re.findall(r'(https?://(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+)', text, re.IGNORECASE)
    portfolio_matches = re.findall(r'(https?://[a-zA-Z0-9.-]+\.(?:com|dev|io|me|org|app)(?:/[^\s]*)?)', text, re.IGNORECASE)

    links.extend(github_matches)
    links.extend(linkedin_matches)
    for p in portfolio_matches:
        if "github" not in p.lower() and "linkedin" not in p.lower() and len(links) < 5:
            links.append(p)
    return list(dict.fromkeys(links))

def extract_candidate_name(text: str) -> str:
    """Heuristic name extraction from top lines of resume."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    ignore_keywords = [
        "resume", "curriculum", "vitae", "cv", "page", "contact",
        "email", "phone", "address", "summary", "profile", "http", "@", ".com"
    ]
    for line in lines[:10]:
        lower_line = line.lower()
        if any(keyword in lower_line for keyword in ignore_keywords):
            continue
        # Names are usually 2 to 4 words, predominantly alphabetic
        words = line.split()
        if 2 <= len(words) <= 4 and all(re.match(r'^[A-Za-z\.\'-]+$', w) for w in words):
            return line
    return "Candidate"

def extract_skills_from_text(text: str) -> List[str]:
    """Match skills against taxonomy using boundary-safe regex matching."""
    text_lower = " " + re.sub(r'[^a-zA-Z0-9\+#\.]', ' ', text.lower()) + " "
    matched_skills = set()

    for pattern_key, canonical_name in SKILL_TAXONOMY.items():
        escaped = re.escape(pattern_key)
        # Match as discrete token or preceded/followed by space/punctuation
        regex = rf'(?:^|[\s,;/()\-]){escaped}(?:$|[\s,;/()\-])'
        if re.search(regex, text_lower, re.IGNORECASE):
            matched_skills.add(canonical_name)

    return sorted(list(matched_skills))

def extract_education_level(text: str) -> Tuple[str, List[Dict[str, Any]]]:
    """Detect degree level and education details."""
    text_lower = text.lower()
    details = []
    highest_level = "Bachelor's Degree"  # default standard

    if re.search(r'\b(ph\.?d|doctor of philosophy|doctorate)\b', text_lower):
        highest_level = "Doctorate (Ph.D.)"
    elif re.search(r'\b(master|m\.?s|m\.?tech|mba|mca|m\.?sc)\b', text_lower):
        highest_level = "Master's Degree"
    elif re.search(r'\b(bachelor|b\.?s|b\.?tech|bca|b\.?sc|b\.?e)\b', text_lower):
        highest_level = "Bachelor's Degree"
    elif re.search(r'\b(associate|diploma)\b', text_lower):
        highest_level = "Associate Degree"

    # Extract lines mentioning education
    edu_lines = []
    lines = text.split("\n")
    for line in lines:
        if any(k in line.lower() for k in ["university", "college", "institute", "bachelor", "master", "degree", "cgpa", "gpa"]):
            clean = line.strip()
            if len(clean) > 5 and clean not in edu_lines:
                edu_lines.append(clean)
                details.append({"text": clean})

    return highest_level, details[:5]

def estimate_experience_years(text: str) -> Tuple[float, List[Dict[str, Any]]]:
    """Extract years of experience from date ranges and explicit phrases."""
    # Look for explicit statements like "5+ years of experience"
    explicit_match = re.search(r'(\d+)\+?\s*years?(?:\s+of)?\s+experience', text, re.IGNORECASE)
    if explicit_match:
        try:
            return float(explicit_match.group(1)), [{"text": explicit_match.group(0)}]
        except Exception:
            pass

    # Look for year ranges like 2019 - 2023 or 2021 - Present
    current_year = 2026
    year_ranges = re.findall(r'\b(20\d{2}|19\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)\b', text, re.IGNORECASE)
    
    total_months = 0
    intervals = []
    for start, end in year_ranges:
        start_y = int(start)
        end_y = current_year if end.lower() in ["present", "current"] else int(end)
        if 1980 <= start_y <= end_y <= current_year + 1:
            diff = end_y - start_y
            if 0 <= diff <= 30:
                intervals.append((start_y, end_y))
                total_months += diff * 12

    # Merge overlapping intervals
    if intervals:
        intervals.sort(key=lambda x: x[0])
        merged = []
        for start, end in intervals:
            if not merged or merged[-1][1] < start:
                merged.append([start, end])
            else:
                merged[-1][1] = max(merged[-1][1], end)
        total_years = sum(end - start for start, end in merged)
        return float(min(total_years, 35.0)), [{"period": f"{s}-{e}"} for s, e in merged]

    return 1.5, []  # Sensible entry/junior baseline if no explicit range found

def parse_resume(file_path: str) -> Dict[str, Any]:
    """
    Comprehensive resume parser:
    Extracts raw text, candidate name, email, phone, links, skills,
    education level, experience years, and generates structured summary.
    """
    raw_text, is_scanned = extract_text_from_file(file_path)
    if not raw_text or is_scanned:
        return {
            "candidate_name": "Candidate",
            "email": "",
            "phone": "",
            "links": [],
            "skills": [],
            "experience_years": 0.0,
            "education_level": "Unknown",
            "summary": "Document appears to be scanned or contains image text. Please upload a searchable PDF or text DOCX.",
            "raw_text": raw_text,
            "is_scanned": is_scanned,
            "projects": [],
            "experience_details": [],
            "education_details": []
        }

    name = extract_candidate_name(raw_text)
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)
    links = extract_links(raw_text)
    skills = extract_skills_from_text(raw_text)
    edu_level, edu_details = extract_education_level(raw_text)
    exp_years, exp_details = estimate_experience_years(raw_text)

    # Extract projects section heuristically
    projects = []
    lines = raw_text.split("\n")
    in_projects = False
    for line in lines:
        lower = line.strip().lower()
        if any(h in lower for h in ["projects", "personal projects", "academic projects", "key projects"]):
            in_projects = True
            continue
        if in_projects and any(h in lower for h in ["experience", "education", "certifications", "skills"]):
            in_projects = False
            break
        if in_projects and len(line.strip()) > 10:
            projects.append({"text": line.strip()})

    summary = f"Qualified professional with {exp_years:.1f} years of estimated experience in software engineering and technology. Demonstrated competencies in {', '.join(skills[:6]) if skills else 'technical roles'}."

    return {
        "candidate_name": name,
        "email": email,
        "phone": phone,
        "links": links,
        "skills": skills,
        "experience_years": exp_years,
        "education_level": edu_level,
        "summary": summary,
        "raw_text": raw_text,
        "is_scanned": is_scanned,
        "projects": projects[:6],
        "experience_details": exp_details,
        "education_details": edu_details
    }
