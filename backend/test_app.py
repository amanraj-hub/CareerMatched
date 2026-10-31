import os
import sys

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("STARTING TALENTLOOP AI SYSTEM VERIFICATION TESTS")
    print("=" * 60)

    # 1. Health Check
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] Health Check: OK ->", res.json())

    # 2. Login as Demo Candidate
    res = client.post("/api/v1/auth/login", json={
        "email": "alex@talentloop.ai",
        "password": "TalentLoop2026!"
    })
    assert res.status_code == 200, f"Candidate login failed: {res.text}"
    candidate_token = res.json()["access_token"]
    candidate_headers = {"Authorization": f"Bearer {candidate_token}"}
    print("[PASS] Candidate Authentication: OK -> Token generated for alex@talentloop.ai")

    # 3. Login as Demo Recruiter
    res = client.post("/api/v1/auth/login", json={
        "email": "recruiter@techloop.io",
        "password": "TalentLoop2026!"
    })
    assert res.status_code == 200, f"Recruiter login failed: {res.text}"
    recruiter_token = res.json()["access_token"]
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}
    print("[PASS] Recruiter Authentication: OK -> Token generated for recruiter@techloop.io")

    # 4. Fetch Jobs
    res = client.get("/api/v1/company/jobs", headers=candidate_headers)
    assert res.status_code == 200, f"Fetch jobs failed: {res.text}"
    jobs = res.json()
    assert len(jobs) >= 3, "Expected seeded jobs"
    job_id = jobs[0]["id"]
    print(f"[PASS] Job Catalog: OK -> Found {len(jobs)} active positions (Selected Job ID: {job_id}: {jobs[0]['title']})")

    # 5. Upload Resume as Candidate
    sample_resume_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample_resumes", "alex_rivera_fullstack.txt")
    with open(sample_resume_path, "rb") as f:
        res = client.post(
            "/api/v1/individual/resumes/upload",
            headers=candidate_headers,
            files={"file": ("alex_rivera_fullstack.txt", f, "text/plain")}
        )
    assert res.status_code == 200, f"Upload resume failed: {res.text}"
    resume = res.json()
    resume_id = resume["id"]
    print(f"[PASS] Resume Parser: OK -> Uploaded ID {resume_id}, extracted {len(resume['parsed_data']['skills'])} skills: {resume['parsed_data']['skills'][:5]}")

    # 6. Run AI Match Analysis
    res = client.post(
        "/api/v1/individual/analyze",
        headers=candidate_headers,
        json={"resume_id": resume_id, "job_id": job_id}
    )
    assert res.status_code == 200, f"Match analysis failed: {res.text}"
    analysis = res.json()
    analysis_id = analysis["id"]
    print(f"[PASS] AI Matching Engine: OK -> Overall Score: {analysis['overall_score']}%, Skill Score: {analysis['skill_score']}%, Exp: {analysis['experience_score']}%")
    print(f"  Matched Skills ({len(analysis['matched_skills'])}): {analysis['matched_skills'][:4]}")
    print(f"  Missing Skills ({len(analysis['missing_skills'])}): {analysis['missing_skills'][:4]}")

    # 7. Verify Skill Gaps & Learning Recommendations
    gap = analysis.get("gap_analysis")
    assert gap is not None, "Expected gap analysis"
    assert len(gap["learning_path"]) == 3, "Expected 3 roadmap phases"
    print(f"[PASS] Skill Gap & Personalized Roadmap: OK -> {len(gap['critical_skills'])} critical gaps, {len(gap['learning_path'])} roadmap phases, {len(gap['projects'])} capstone projects")

    # 8. Recruiter Bulk Screening
    sample2 = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample_resumes", "sarah_chen_ai_ml.txt")
    sample3 = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample_resumes", "michael_ross_devops.txt")
    with open(sample2, "rb") as f2, open(sample3, "rb") as f3:
        res = client.post(
            f"/api/v1/company/screenings/bulk-upload?job_id={job_id}",
            headers=recruiter_headers,
            files=[
                ("files", ("sarah_chen_ai_ml.txt", f2, "text/plain")),
                ("files", ("michael_ross_devops.txt", f3, "text/plain"))
            ]
        )
    assert res.status_code == 200, f"Bulk screening failed: {res.text}"
    screened = res.json()
    print(f"[PASS] Bulk Candidate Screening: OK -> Screened {len(screened)} resumes against Job {job_id}")

    # 9. Candidate Leaderboard & Ranking
    res = client.get(f"/api/v1/company/screenings/leaderboard/{job_id}", headers=recruiter_headers)
    assert res.status_code == 200, f"Leaderboard failed: {res.text}"
    leaderboard = res.json()
    assert len(leaderboard) >= 4, "Expected ranked candidates"
    # Verify ranked strictly descending
    scores = [c["score"] for c in leaderboard]
    assert scores == sorted(scores, reverse=True), "Leaderboard must be sorted strictly descending by score"
    print(f"[PASS] Candidate Leaderboard: OK -> Ranked {len(leaderboard)} candidates from #{scores[0]}% down to #{scores[-1]}%")

    # 10. Side-by-Side Comparison
    compare_ids = [leaderboard[0]["id"], leaderboard[1]["id"]]
    res = client.get(f"/api/v1/company/screenings/compare?candidate_ids={compare_ids[0]}&candidate_ids={compare_ids[1]}", headers=recruiter_headers)
    assert res.status_code == 200, f"Comparison failed: {res.text}"
    comparison = res.json()
    print(f"[PASS] Head-to-Head Comparison: OK -> Compared '{comparison['candidates'][0]['candidate_name']}' vs '{comparison['candidates'][1]['candidate_name']}'")

    # 11. Export Screening CSV
    res = client.get(f"/api/v1/company/screenings/export/{job_id}", headers=recruiter_headers)
    assert res.status_code == 200, f"Export CSV failed: {res.text}"
    assert "Rank,Candidate Name" in res.text, "CSV header expected"
    print(f"[PASS] CSV Screening Export: OK -> Generated {len(res.text.splitlines())} rows of candidate data")

    # 12. Frontend Production Static Serving
    res = client.get("/")
    assert res.status_code == 200, f"Frontend root failed: {res.text}"
    assert "TalentLoop" in res.text, "Expected TalentLoop in HTML"
    print("[PASS] Frontend Single-Origin Serving: OK -> index.html served directly by FastAPI")

    print("=" * 60)
    print("ALL 12 CORE FUNCTIONAL SYSTEM TESTS PASSED PERFECTLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
