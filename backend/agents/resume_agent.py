from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from backend.services.stream_manager import stream_manager
from backend.services.vector_store import add_document
from backend.services.pdf_parser import parse_pdf_from_bytes
from backend.config import GROQ_API_KEY, GROQ_MODEL
import json
import uuid

async def analyze_resume(file_bytes: bytes, session_id: str):
    """Parses a PDF into text, uses Groq LLM to extract structured data."""
    await stream_manager.emit(session_id, "ACTION", "Starting PyMuPDF text extraction from uploaded resume.")
    
    text = parse_pdf_from_bytes(file_bytes)
    if not text:
        await stream_manager.emit(session_id, "ERROR", "Failed to extract text from the PDF. Please upload a valid PDF.")
        return None

    await stream_manager.emit(session_id, "THOUGHT", "Resume text extracted. Sending to Groq LLaMA for deep skill extraction.")

    llm = ChatGroq(model=GROQ_MODEL, temperature=0, api_key=GROQ_API_KEY)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert technical recruiter analyzing a resume. 
        Extract strictly the following in a valid JSON object:
        - "skills": List of strings (maximum 30 key technical skills)
        - "experience_level": String ("Junior", "Mid", "Senior")
        - "role_preference": String (The most likely job title this person wants)

        ONLY output valid JSON. No prefix, no markdown block, no extra words.
        """),
        ("user", "Resume Text: {text}")
    ])
    
    chain = prompt | llm
    try:
        response = await chain.ainvoke({"text": text[:6000]})
        clean_text = response.content.strip().strip('`').replace('json\n', '').replace('json', '')
        parsed_data = json.loads(clean_text)
        
        await stream_manager.emit(session_id, "DECISION", f"Extracted {len(parsed_data.get('skills', []))} skills. Level: {parsed_data.get('experience_level')}.")
        
        # Index the resume for semantic matching
        r_id = str(uuid.uuid4())
        add_document(doc_id=r_id, text=text, metadata={"type": "resume"})
        
        return {
            "id": r_id,
            "raw_text": text,
            "parsed_data": parsed_data
        }

    except Exception as e:
        print(f"ResumeAgent error: {e}")
        await stream_manager.emit(session_id, "ERROR", f"Resume analysis failed: {str(e)}")
        return None
