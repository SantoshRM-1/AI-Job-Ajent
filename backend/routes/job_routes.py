from fastapi import APIRouter
from backend.models.request_model import JobRequest
from backend.tools.job_search_tool import fetch_jobs
from backend.tools.resume_analyzer import analyze_resume
from backend.tools.matching_engine import rank_jobs
import json

router = APIRouter()


@router.post("/search-jobs")
def search_jobs(request: JobRequest):
    query = request.query
    jobs = fetch_jobs(query)
    return {"jobs": jobs}


@router.post("/analyze-resume")
@router.post("/smart-job-search")
def smart_job_search(request: dict):
    query = request.get("query")
    resume_text = request.get("resume_text")

    jobs = fetch_jobs(query)

    # ✅ now direct dict (no JSON parsing)
    analysis_data = analyze_resume(resume_text)
    user_skills = analysis_data.get("skills", [])

    ranked_jobs = rank_jobs(jobs, user_skills)

    return {
    "jobs": ranked_jobs,
    "skills": user_skills,
    "thoughts": [
        "Searching jobs based on query",
        "Analyzing resume skills",
        "Matching jobs with skills",
        "Ranking jobs by relevance"
    ]
}