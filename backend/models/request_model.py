from pydantic import BaseModel

class JobRequest(BaseModel):
    query: str