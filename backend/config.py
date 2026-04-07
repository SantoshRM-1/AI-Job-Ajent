import os
from dotenv import load_dotenv

# Load from both possible locations
load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"), override=True)
load_dotenv(dotenv_path=os.path.join(os.getcwd(), "backend", ".env"), override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

if not GROQ_API_KEY:
    print("\n⚠️  GROQ_API_KEY not found in environment.")
    GROQ_API_KEY = input("Enter your GROQ API Key: ").strip()
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is required to run this application.")

GROQ_MODEL = "llama-3.3-70b-versatile"

