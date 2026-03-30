import requests
import os
from dotenv import load_dotenv

load_dotenv()

SERP_API_KEY = os.getenv("SERP_API_KEY")

def fetch_jobs(query):
    url = "https://serpapi.com/search.json"

    params = {
        "engine": "google_jobs",
        "q": query,
        "api_key": SERP_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    jobs = []

    for job in data.get("jobs_results", []):
        jobs.append({
            "title": job.get("title"),
            "company": job.get("company_name"),
            "location": job.get("location"),
            "link": job.get("related_links", [{}])[0].get("link")
        })

    return jobs