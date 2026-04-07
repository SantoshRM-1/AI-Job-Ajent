from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from backend.services.stream_manager import stream_manager
from backend.config import GROQ_API_KEY, GROQ_MODEL
from typing import Dict, List, Any
import json
import asyncio

async def generate_explanation(job: Dict[str, Any], resume_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate explanation, skill gaps and interview questions using Groq."""
    llm = ChatGroq(model=GROQ_MODEL, temperature=0, api_key=GROQ_API_KEY)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an HR expert evaluating a matched job for a candidate.
        Read the given job listing and resume summary.
        Output exactly a JSON object with these exact keys:
        - "reasoning": "2-3 sentence human-readable explanation of why this job matches or lacks fit."
        - "matched_skills": ["Skill1", "Skill2"]
        - "missing_skills": ["SkillA", "SkillB"]
        - "interview_questions": ["Q1", "Q2", "Q3", "Q4", "Q5"]
        
        Ensure EXACTLY 5 interview questions. Output ONLY valid JSON. No markdown, no code blocks.
        """),
        ("user", "Job Title: {title}\nCompany: {company}\nDescription: {description}\n\nCandidate Skills: {skills}\nExperience Level: {exp}")
    ])
    
    chain = prompt | llm
    parsed = resume_data.get("parsed_data", {})
    
    try:
        response = await chain.ainvoke({
            "title": job.get("title"),
            "company": job.get("company"),
            "description": str(job.get("description", ""))[:2000],
            "skills": ", ".join(parsed.get("skills", [])),
            "exp": parsed.get("experience_level", "Unknown")
        })
        
        clean_text = response.content.strip().strip('`').replace('json\n', '').replace('json', '')
        result = json.loads(clean_text)
        
        score = job.get("match_score", 0)
        if 40.0 <= score <= 60.0:
            confidence = "Uncertain match"
        elif score > 75:
            confidence = "High confidence"
        else:
            confidence = "Moderate fit"
        
        return {
            "reasoning": result.get("reasoning", "Strong match based on overall profile alignment."),
            "matched_skills": result.get("matched_skills", []),
            "missing_skills": result.get("missing_skills", []),
            "interview_questions": result.get("interview_questions", []),
            "confidence": confidence
        }
    except Exception as e:
        print(f"ExplanationAgent error for {job.get('title')}: {e}")
        return {
            "reasoning": "Based on vector similarity and heuristic matching, this job aligns with your profile.",
            "matched_skills": parsed.get("skills", [])[:5],
            "missing_skills": [],
            "interview_questions": [
                "Tell me about your background and experience.",
                "Why are you interested in this role?",
                "What is your greatest technical strength?",
                "Describe a challenging project you completed.",
                "Where do you see yourself in 5 years?"
            ],
            "confidence": "Fallback calculated"
        }

async def generate_explanations(jobs: List[Dict[str, Any]], resume_data: Dict[str, Any], session_id: str):
    """Generates explanations for the top 5 matched jobs."""
    await stream_manager.emit(session_id, "ACTION", "Generating Explainable AI insights for top 5 matched jobs.")
    
    top_jobs = jobs[:5]
    
    async def process_job(job):
        explanations = await generate_explanation(job, resume_data)
        job.update(explanations)
        return job

    await stream_manager.emit(session_id, "THOUGHT", "Querying Groq LLaMA to analyze skill gaps and produce interview questions.")
    
    updated_top = list(await asyncio.gather(*(process_job(job) for job in top_jobs)))
    
    for i, uj in enumerate(updated_top):
        jobs[i] = uj
        
    await stream_manager.emit(session_id, "DECISION", f"Explanations and interview prep generated for top {len(updated_top)} jobs. Pipeline complete!")
    return jobs
