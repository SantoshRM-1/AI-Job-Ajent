# FutureRole: AI Job Search Agent 🚀

An advanced, full-stack AI-powered job matching platform. FutureRole uses **multi-agent orchestration**, **vector search**, and **Groq's hyper-fast LLaMA 3.3 model** to analyze candidate resumes, score job fits, and generate real-time explainable AI insights.

## ✨ Features
- **Live Agent Reasoning:** Watch the AI's internal thoughts stream to the frontend in real-time via Server-Sent Events (SSE).
- **Hybrid Intelligence Scoring:** Jobs are ranked using a custom weighted algorithm: `(0.4 × Semantic Text Similarity) + (0.3 × LLM Reasoning) + (0.2 × Rule-based Logic) + (0.1 × Recency)`.
- **Explainable AI (XAI):** See exactly *why* a job matches. Extracts missing skills, aligned skills, and generates 5 highly customized mock interview questions per job.
- **Resume Parsing:** Upload your PDF resume, and the AI extracts technical skills, infers experience level, and determines likely role preferences.
- **Lightning Fast:** Uses `ChatGroq` running `llama-3.3-70b-versatile` for blazing fast, sub-second reasoning steps.

## 🛠️ Technology Stack
- **Backend:** FastAPI (Async), Python 3, LangChain, PyMuPDF
- **Vector Search:** `sentence-transformers` + `numpy` in-memory cosine similarity
- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Vite
- **AI Models:** Groq (LLaMA 3.3 70B), Sentence Transformers (`all-MiniLM-L6-v2`)
- **APIs:** SerpAPI (Remote job fetching)

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/SantoshRM-1/AI-Job-Ajent.git
cd AI-Job-Ajent
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
SERP_API_KEY=your_serpapi_key_here
GROQ_API_KEY=gsk_your_groq_key_here
```

### 3. Start the Backend (FastAPI)
```bash
# Navigate to the project root
python -m venv backend/venv

# Activate virtual environment
# Windows:
.\backend\venv\Scripts\activate
# Mac/Linux:
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start the Frontend (React)
Open a **new** terminal window:
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` to use the application!

## 🧠 Multi-Agent Architecture
The backend is driven by a decentralized agent workflow:
1. `PlannerAgent`: Reads the payload and decides the pipeline order dynamically.
2. `JobSearchAgent`: Queries SerpAPI for real-time remote job listings.
3. `ResumeAgent`: Extracts text with PyMuPDF and parses semantic parameters.
4. `MatchingAgent`: Combines Vector Embedding scoring and LLaMA heuristic logic to rank jobs 0-100.
5. `ExplanationAgent`: Runs parallel background tasks to generate skill gaps and interview prep.

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
