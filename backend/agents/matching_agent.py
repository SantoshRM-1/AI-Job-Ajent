from backend.services.stream_manager import stream_manager
from backend.services.vector_store import calculate_cosine_similarity
from backend.config import GROQ_API_KEY, GROQ_MODEL
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import json
import asyncio

async def compute_llm_score(job: dict, resume_text: str) -> float:
    """Asks Groq LLM to rate the resume-job fit from 0-100."""
    llm = ChatGroq(model=GROQ_MODEL, temperature=0, api_key=GROQ_API_KEY)
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are evaluating a candidate's fit for a job. 
        Compare the provided Resume text with the Job description.
        Output ONLY a JSON object exactly like this: {"score": 85}
        The score should be a float between 0.0 and 100.0. No markdown or extra text.
        """),
        ("user", "Resume:\n{resume}\n\nJob Title: {title}\nCompany: {company}\nJob Description: {description}")
    ])
    chain = prompt | llm
    try:
        response = await chain.ainvoke({
            "resume": resume_text[:3000],
            "title": job.get("title"),
            "company": job.get("company"),
            "description": str(job.get("description", ""))[:2000]
        })
        clean_text = response.content.strip().strip('`').replace('json\n', '').replace('json', '')
        data = json.loads(clean_text)
        return float(data.get("score", 50.0))
    except Exception as e:
        print(f"LLM scoring error: {e}")
        return 50.0

def compute_rule_based_score(job: dict, parsed_resume: dict) -> float:
    """Rules engine: check skill overlap and experience level inference."""
    score = 0.0
    
    title_lower = job.get("title", "").lower()
    exp_lvl = parsed_resume.get("experience_level", "Mid").lower()
    if exp_lvl == "senior" and ("senior" in title_lower or "lead" in title_lower or "principal" in title_lower):
        score += 50.0
    elif exp_lvl == "junior" and ("junior" in title_lower or "entry" in title_lower):
        score += 50.0
    elif exp_lvl == "mid" and "senior" not in title_lower and "junior" not in title_lower:
        score += 50.0
    else:
        score += 25.0

    job_desc = job.get("description", "").lower()
    skills = parsed_resume.get("skills", [])
    matches = sum(1 for skill in skills if skill.lower() in job_desc)
    skill_score = (matches / len(skills)) * 50.0 if skills else 0.0
    score += skill_score
    return min(score, 100.0)

def compute_recency_score(job: dict) -> float:
    return 80.0

async def match_jobs(jobs: list, resume_data: dict, query_location: str, session_id: str):
    """
    Hybrid Scoring Formula:
    Final Score = 0.4 * embedding + 0.3 * LLM + 0.2 * rules + 0.1 * recency
    """
    await stream_manager.emit(session_id, "ACTION", f"Scoring {len(jobs)} jobs using Hybrid Intelligence Formula.")
    
    resume_text = resume_data.get("raw_text", "")
    parsed_json = resume_data.get("parsed_data", {})

    async def process_job(job):
        try:
            job_text = f"{job.get('title')} {job.get('description')}"
            emb_score = calculate_cosine_similarity(job_text, resume_text) * 100.0
            llm_score = await compute_llm_score(job, resume_text)
            rule_score = compute_rule_based_score(job, parsed_json)
            recency_score = compute_recency_score(job)
            
            final_score = (0.4 * emb_score) + (0.3 * llm_score) + (0.2 * rule_score) + (0.1 * recency_score)
            
            job["match_score"] = round(final_score, 1)
            job["breakdown"] = {
                "embedding": round(emb_score, 1),
                "llm": round(llm_score, 1),
                "rule": round(rule_score, 1),
                "recency": round(recency_score, 1)
            }
        except Exception as e:
            print(f"Error scoring job {job.get('title')}: {e}")
            job["match_score"] = 50.0
            job["breakdown"] = {"embedding": 50.0, "llm": 50.0, "rule": 50.0, "recency": 80.0}
        return job

    await stream_manager.emit(session_id, "THOUGHT", "Calculating (0.4 × Emb) + (0.3 × LLM) + (0.2 × Rule) + (0.1 × Recency).")
    
    tasks = [process_job(job) for job in jobs]
    scored_jobs = list(await asyncio.gather(*tasks))
    
    scored_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)
    
    if scored_jobs:
        await stream_manager.emit(session_id, "DECISION", f"Top match: '{scored_jobs[0]['title']}' at {scored_jobs[0]['company']} — Score: {scored_jobs[0]['match_score']}/100.")
    
    return scored_jobs
