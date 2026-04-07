# AI Job Search Agent with Resume Matching & Smart Ranking

A production-ready full-stack AI application powered by a LangChain Multi-Agent architecture, FAISS Vector Search, and a beautiful React + Tailwind + Framer Motion frontend. It searches real-time job listings, intelligently scores them against your parsed resume using a hybrid intelligence formula, and provides Explainable AI insights.

## Architecture Highlights
- **Planner Agent**: Dynamically determines the necessary job search steps.
- **Explainable AI (XAI)**: Anthropic's Claude evaluates candidates, explains why jobs match, highlights missing skills, and generates mock interview questions.
- **Hybrid Scoring Formula**: `0.4 (Vector Match) + 0.3 (LLM Reasoning) + 0.2 (Rule-Based Overlap) + 0.1 (Recency)`
- **Real-Time Agent Thoughts (SSE)**: The frontend streams live server-sent events for a transparent look into the agent's actions.

## 🚀 Setup Instructions

### Prerequisites
- Docker & Docker Compose
- API Keys: Anthropic Claude (or OpenAI), RapidAPI JSearch, LangSmith (optional for tracing).

### Quickstart

1. Clone and setup environment variables.
```bash
cp backend/.env.example backend/.env
```
2. Edit `backend/.env` with your API keys.

3. Start the application via Docker.
```bash
docker-compose up --build
```
> The frontend will be available at `http://localhost:5173`
> The FastAPI backend will be available at `http://localhost:8000`

### Local Development (Without Docker)
**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📸 Demos & Walkthrough
*LangSmith Trace Example:*
When `LANGCHAIN_TRACING_V2=true` is set, all underlying agent steps (JobSearchAgent, ResumeAnalyzerAgent, ExplanationAgent) stream logs cleanly to the LangSmith dashboard.

## 🛠 Tech Stack
- **Backend:** Python 3.11, FastAPI, LangChain, FAISS, PyMuPDF, sentence-transformers, SQLite.
- **Frontend:** React 19, TailwindCSS v4, Framer Motion, Recharts, Lucide Icons.