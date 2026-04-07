from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.models.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String)
    location = Column(String)
    description = Column(Text)
    embedding_id = Column(String, nullable=True) # References FAISS key
    last_updated = Column(DateTime, default=datetime.utcnow)

    interactions = relationship("JobInteraction", back_populates="job")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, index=True)
    extracted_text = Column(Text)
    parsed_json = Column(Text) # JSON string of skills/experience
    embedding_id = Column(String, nullable=True) # References FAISS key
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class SearchQuery(Base):
    __tablename__ = "search_queries"

    id = Column(String, primary_key=True, index=True)
    query = Column(String, index=True)
    location = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class JobInteraction(Base):
    __tablename__ = "job_interactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(String, ForeignKey("jobs.id"))
    action = Column(String) # e.g. "viewed", "saved", "applied"
    timestamp = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="interactions")
