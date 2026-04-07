import requests
import os
from typing import List, Dict, Any

def fetch_jobs(query: str, location: str = "") -> List[Dict[str, Any]]:
    """
    Fetches real job listings using the JSearch API (RapidAPI).
    Uses a default location if empty.
    """
    api_key = os.getenv("RAPIDAPI_KEY")
    if not api_key or api_key == "your_rapidapi_key_here":
        print("Warning: RAPIDAPI_KEY not configured. Returning mock data.")
        return get_mock_jobs(query, location)

    # Defaults handling
    actual_location = location.strip() if location else "Remote"
    search_query = f"{query} {actual_location}"

    url = "https://jsearch.p.rapidapi.com/search"
    querystring = {"query": search_query, "num_pages": "1"}

    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        response.raise_for_status()
        data = response.json()
        jobs_raw = data.get("data", [])
        
        # Clean up data for the DB schema
        cleaned_jobs = []
        for job in jobs_raw:
            cleaned_jobs.append({
                "id": job.get("job_id"),
                "title": job.get("job_title"),
                "company": job.get("employer_name"),
                "location": f"{job.get('job_city', '')}, {job.get('job_country', '')}",
                "description": job.get("job_description", "")[:2000] # Limiting size
            })
        return cleaned_jobs
    except Exception as e:
        print(f"JSearch API error: {e}")
        return get_mock_jobs(query, location)

def get_mock_jobs(query: str, location: str) -> List[Dict[str, Any]]:
    """Fallback if API reaches limits or isn't configured."""
    return [
        {
            "id": "mock_1",
            "title": f"Senior {query.split()[0]} Engineer",
            "company": "TechCorp Inc.",
            "location": location or "Remote",
            "description": f"We are looking for a skilled {query} with extensive experience in Python, AWS, and modern scalable architectures. The ideal candidate has 5+ years of experience and is a team player."
        },
        {
            "id": "mock_2",
            "title": f"Lead {query} Developer",
            "company": "StartupX",
            "location": location or "India",
            "description": f"Exciting opportunity for a {query} professional to lead a fast-paced team. Strong background in React, Node, and team leadership needed."
        }
    ]
