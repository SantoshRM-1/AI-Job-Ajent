#  AI Job Search Agent

An intelligent job recommendation system that searches, analyzes, and ranks jobs based on user skills and resume.

---

##  Features

-  Real-time job search
-  Resume skill extraction
-  Smart job matching & ranking
-  Match score + skill gap analysis
-  Thought tracing (AI reasoning display)

---

##  Tech Stack

- Frontend: React (Vite)
- Backend: FastAPI
- AI Logic: Python
- APIs: Job Search API

---

##  How It Works

1. User enters job query
2. System fetches job listings
3. Resume is analyzed to extract skills
4. Matching engine ranks jobs
5. Results displayed with scores + reasoning

---

##  Output

- Job title, company, location
- Match score
- Matched & missing skills
- Thought process of AI agent

---

##  Setup

```bash
# Backend
cd backend
uvicorn backend.main:app --reload

# Frontend
cd frontend
npm run dev
