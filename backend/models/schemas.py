from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

# SSE Stream Format
class SSEMessage(BaseModel):
    type: str = Field(..., description="'THOUGHT' | 'ACTION' | 'DECISION' | 'ERROR'")
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class JobInteractionCreate(BaseModel):
    job_id: str
    action: str

# Resume Parsed Response Structure
class ResumeParsed(BaseModel):
    skills: List[str]
    experience_level: str
    role_preference: str

class MatchJobsRequest(BaseModel):
    query: str
    location: Optional[str] = None
    # the frontend will upload the resume as multipart/form-data
    # so the exact schema might differ for the route, but this is base.
