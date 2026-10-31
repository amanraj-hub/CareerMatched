# TalentLoop AI
### AI-Powered Resume Matching, Skill Gap Analysis & Recruitment Platform

TalentLoop AI is a production-ready, full-stack career development and intelligent talent acquisition platform. It bridges the gap between ambitious job seekers and forward-thinking companies through explainable resume parsing, multi-criteria compatibility scoring, granular skill-gap diagnosis, personalized 6-week learning roadmaps, and automated bulk candidate screening.

---

## 🌟 Key Capabilities

### 1. 🎓 Candidate / Job Seeker Portal
- **Multi-Format Resume Ingestion**: Upload resumes in **PDF**, **DOCX**, or **TXT** format (with automated scanned image PDF detection).
- **NLP Information Extraction**: Automatically extracts candidate contact information (Name, Email, Phone, GitHub, LinkedIn), standardized technical skills (indexed from a 400+ taxonomy), years of experience, and highest education degree.
- **Explainable Multi-Factor Compatibility Scoring**: Evaluates candidate resumes against job descriptions based on a transparent, mathematical formula:
  - **Technical Skills Fit (45% Weight)**: Exact match, alias mapping, and related framework resolution.
  - **Experience Seniority (20% Weight)**: Evaluates demonstrated years against target requirements.
  - **Educational Qualifications (15% Weight)**: Evaluates degree criteria (Ph.D., Master's, Bachelor's).
  - **Semantic Role Relevance (20% Weight)**: TF-IDF n-gram vectorization and Cosine Similarity scoring.
- **Granular Skill Gap Analysis**: Categorizes missing competencies into **Critical** (high priority), **Important** (medium priority), and **Additional** (nice-to-have).
- **Personalized 6-Week Learning Roadmap**: Automatically generates phased career milestones (Foundations, Deep Dive, Capstone Polish).
- **Curated Learning Resources**: Recommends authentic courses and interactive documentation (React Docs, Harvard CS50, freeCodeCamp, DeepLearning.AI, PostgreSQL Global Group).
- **Practical Capstone Projects**: Provides detailed portfolio project blueprints with recommended tech stack, key features, and learning outcomes tailored to missing skills.
- **Analysis History & Progress Tracking**: Stores historical assessments to track score progression over time.

### 2. 🏢 Recruiter & Company Portal
- **Job Description Management**: Create, edit, and publish job listings with department tags, experience levels, and required competencies.
- **Bulk Resume Screening**: Drag-and-drop multiple candidate resumes simultaneously (up to 50 resumes per batch). The system parses and analyzes every applicant automatically.
- **Candidate Leaderboard & Rankings**: Real-time ranked applicant leaderboard sorted by overall compatibility percentage.
- **Multi-Parameter Filtering**:
  - Minimum Compatibility Score slider (0% to 100%).
  - Filter by specific required skills (e.g. must possess *React* or *Docker*).
  - Filter by recruitment status (*New*, *Shortlisted*, *Interviewing*, *Offered*, *Rejected*).
  - Search by applicant name or email.
- **Side-by-Side Head-to-Head Comparison**: Select between 2 and 4 candidates to inspect a side-by-side comparative matrix of dimensional scores and required skills checklists.
- **Applicant Dossier & Internal Notes**: Recruiter inspection modal with candidate status switcher and internal hiring notes.
- **One-Click CSV Export**: Download complete, formatted screening reports for recruitment team reviews and applicant tracking systems.

---

## 🏗️ System Architecture & Technology Stack

```
   ┌───────────────────────────────────────────────────────────────┐
   │                  TALENTLOOP AI PLATFORM                       │
   └───────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌───────────────────┐                               ┌───────────────────┐
│  FRONTEND (React) │                               │  BACKEND (FastAPI)│
│  - Vite + TS      │                               │  - Python 3.12    │
│  - Tailwind CSS   │       HTTP REST APIs / JWT    │  - SQLAlchemy ORM │
│  - Lucide Icons   │◄─────────────────────────────►│  - Pydantic v2    │
│  - Score Gauges   │                               │  - Uvicorn Server │
└───────────────────┘                               └───────────────────┘
                                                              │
                    ┌─────────────────────────────────────────┼────────────────────────┐
                    ▼                                         ▼                        ▼
         ┌─────────────────────┐                   ┌─────────────────────┐   ┌─────────────────┐
         │     DATABASE        │                   │    AI / NLP ENGINE  │   │  STATIC HOSTING │
         │ - SQLite (Local)    │                   │ - TF-IDF Vectorizer │   │ - FastAPI       │
         │ - Supabase Postgres │                   │ - Cosine Similarity │   │   mounts Vite   │
         │   (Production)      │                   │ - PyPDF / Docx      │   │   dist bundle   │
         └─────────────────────┘                   │ - Skill Taxonomy    │   └─────────────────┘
                                                   └─────────────────────┘
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: Python 3.12, FastAPI, SQLAlchemy ORM, Pydantic v2, Python-Jose (JWT), BCrypt, Python-Multipart.
- **AI & NLP**: Scikit-Learn (TF-IDF vectorizer, cosine similarity), NumPy, PyPDF, Python-Docx.
- **Database**: SQLite (zero-configuration local development) and PostgreSQL / Supabase (cloud deployment).

---

## ⚡ Quick Start (Local Setup)

### Option A: 1-Click Startup on Windows
Double-click `START_TALENTLOOP.bat` in the project root. The script will:
1. Verify Python and Node.js.
2. Build the production React frontend.
3. Launch the FastAPI server at `http://localhost:8000`.
4. Automatically open your default browser.

### Option B: Manual Setup

#### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python run.py
```

#### 2. Frontend Setup (Development Mode)
```bash
# Navigate to frontend
cd frontend

# Install packages
npm install

# Start Vite dev server with proxy
npm run dev
```

Visit `http://localhost:5173` for Vite hot-reload or `http://localhost:8000` for the unified server.

---

## 🔑 Pre-Configured Demo Accounts

For immediate testing, judges and reviewers can log in with one click using the built-in demo credentials on the Sign In modal:

| Portal | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Candidate Portal** | `alex@talentloop.ai` | `TalentLoop2026!` | Job Seeker / Candidate |
| **Recruiter Portal** | `recruiter@techloop.io` | `TalentLoop2026!` | Company / Recruiter |

*Note: You can also register any new candidate or company account through the Register tab.*

---

## 🚀 Deploy to GitHub + Render

This repository includes a GitHub Actions build check and a Render Blueprint (`render.yaml`). Render builds the React frontend, starts the FastAPI backend, and provisions PostgreSQL for persistent application data.

### 1. Upload the project to GitHub

1. Create a new **empty** repository on GitHub (do not add a README or license there).
2. Extract this project ZIP and open a terminal in the `talentloop-ai` project folder (the folder containing this README).
3. Run the following commands, replacing the URL with your repository URL:

```bash
git init
git add .
git commit -m "Prepare TalentLoop AI for deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

The `.gitignore` excludes virtual environments, local databases, secrets, uploaded resumes, and generated frontend files. Do not commit your `.env` file or production secrets.

### 2. Deploy on Render

1. Sign in at [Render](https://render.com) and choose **New → Blueprint**.
2. Connect the GitHub repository you just pushed.
3. Render will detect `render.yaml`. Review the services and approve the Blueprint.
4. The Blueprint creates a Python web service and a managed PostgreSQL database. The database plan in `render.yaml` is `basic-256mb` (paid); the web service is configured on the free plan.
5. Wait for the first deployment to finish, then open the service URL shown by Render.
6. Check `https://YOUR-RENDER-SERVICE.onrender.com/health`. It should return JSON with `"status":"healthy"`.

The `SECRET_KEY` is generated by Render and `DATABASE_URL` is wired to the provisioned database automatically. No `.env` file is uploaded to GitHub and no frontend API URL needs to be changed: the frontend calls `/api/v1` on the same domain as the backend.

### 3. Important hosting notes

- Render's free web service can spin down when idle, so the first request after inactivity may take a little longer.
- The PostgreSQL database is persistent and billed separately. Check Render's current pricing before approving the Blueprint.
- The free web service has an ephemeral filesystem. Uploaded resume files may be lost when the service restarts or redeploys, even though parsed/application records in PostgreSQL remain. For durable resume-file storage, upgrade the web service to a plan that supports a persistent disk and attach a disk mounted at `/opt/render/project/src/backend/uploads`, or move uploads to object storage.
- Demo accounts are seeded on startup for testing. Change/remove demo credentials and review the seed behavior before using this app with real users.

### 4. Deploy updates

After the first deployment, push changes to the connected GitHub branch. Render will automatically rebuild and deploy because `autoDeploy` is enabled in `render.yaml`.

## 🧪 Verification & Test Suite

TalentLoop AI includes an automated integration test suite verifying health, authentication, parsing, AI scoring, bulk screening, leaderboards, and CSV exports:

```bash
cd backend
venv\Scripts\python test_app.py
```

Expected output:
```text
============================================================
STARTING TALENTLOOP AI SYSTEM VERIFICATION TESTS
============================================================
[PASS] Health Check: OK
[PASS] Candidate Authentication: OK -> Token generated for alex@talentloop.ai
[PASS] Recruiter Authentication: OK -> Token generated for recruiter@techloop.io
[PASS] Job Catalog: OK -> Found 3 active positions
[PASS] Resume Parser: OK -> Uploaded ID 1, extracted 35 skills
[PASS] AI Matching Engine: OK -> Overall Score: 78.3%, Skill Score: 90.0%, Exp: 96.7%
[PASS] Skill Gap & Personalized Roadmap: OK -> 3 roadmap phases, 2 capstone projects
[PASS] Bulk Candidate Screening: OK -> Screened resumes against Job 1
[PASS] Candidate Leaderboard: OK -> Ranked candidates from #93.5% down to #55.2%
[PASS] Head-to-Head Comparison: OK -> Compared 'Sarah Chen' vs 'Marcus Vance'
[PASS] CSV Screening Export: OK -> Generated candidate data report
[PASS] Frontend Single-Origin Serving: OK -> index.html served directly by FastAPI
============================================================
ALL 12 CORE FUNCTIONAL SYSTEM TESTS PASSED PERFECTLY!
============================================================
```

---

## 📜 API Documentation

FastAPI provides interactive Swagger documentation. When the backend is running, open:
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **ReDoc UI**: `http://localhost:8000/redoc`

### Core Endpoints

#### Authentication
- `POST /api/v1/auth/register` — Register individual or recruiter.
- `POST /api/v1/auth/login` — Authenticate and receive JWT token.
- `GET /api/v1/auth/me` — Retrieve active profile.

#### Candidate
- `POST /api/v1/individual/resumes/upload` — Upload PDF/DOCX/TXT resume.
- `GET /api/v1/individual/resumes` — List candidate resumes.
- `POST /api/v1/individual/analyze` — Run AI match against job and compute skill gaps.
- `GET /api/v1/individual/analyses` — Retrieve analysis history.
- `GET /api/v1/stats/individual` — Candidate career readiness metrics.

#### Company & Recruitment
- `POST /api/v1/company/jobs` — Create job description with required skills.
- `GET /api/v1/company/jobs` — List company or active listings.
- `POST /api/v1/company/screenings/bulk-upload` — Bulk upload and rank applicants.
- `GET /api/v1/company/screenings/leaderboard/{job_id}` — Ranked leaderboard with filters.
- `GET /api/v1/company/screenings/compare` — Compare 2-4 candidates side by side.
- `PATCH /api/v1/company/screenings/{id}/status` — Update candidate hiring status.
- `GET /api/v1/company/screenings/export/{job_id}` — Export screening results to CSV.
- `GET /api/v1/stats/company` — Recruiter pipeline metrics.

---

## 📄 License
This project is licensed under the MIT License.
