import os
from dotenv import load_dotenv
import requests

load_dotenv()
SERP_API_KEY = os.getenv("SERP_API_KEY")

def test():
    print(f"Key loaded: {bool(SERP_API_KEY)}")
    url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_jobs",
        "q": "Python Developer Bangalore",
        "api_key": SERP_API_KEY
    }
    res = requests.get(url, params=params)
    data = res.json()
    print("Keys in response:", data.keys())
    if "error" in data:
        print("API Error:", data["error"])
    jobs_results = data.get("jobs_results", [])
    print(f"Job results found: {len(jobs_results)}")
    if jobs_results:
        print("First job title:", jobs_results[0].get("title"))

if __name__ == "__main__":
    test()
