import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_resume(resume_text):
    skills_db = [
        "python", "sql", "machine learning",
        "java", "c++", "javascript",
        "react", "node", "aws", "docker"
    ]

    found_skills = []

    resume_text = resume_text.lower()

    for skill in skills_db:
        if skill in resume_text:
            found_skills.append(skill.capitalize())

    return {
        "skills": found_skills,
        "experience": "Fresher"
    }