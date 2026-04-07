from backend.tools.jsearch_api import fetch_jobs
from backend.services.stream_manager import stream_manager
from backend.services.vector_store import add_document
import asyncio
import uuid

async def run_search(query: str, location: str, session_id: str):
    """Executes the job search, emits thoughts, and indexes results into FAISS."""
    await stream_manager.emit(session_id, "ACTION", f"Initializing job search for '{query}' in '{location or 'Remote'}'")
    
    await asyncio.sleep(0.5) # Slight delay purely for UI timeline presentation effect
    await stream_manager.emit(session_id, "THOUGHT", "Querying JSearch API for real-time listings...")
    
    jobs = fetch_jobs(query, location)
    
    if not jobs:
        await stream_manager.emit(session_id, "ERROR", "No jobs found for this query.")
        return []
        
    await stream_manager.emit(session_id, "DECISION", f"Retrieved {len(jobs)} jobs. Indexing into vector store for ranking.")
    
    # Simple asynchronous loop to chunk and index jobs into FAISS
    stored_jobs = []
    for job in jobs:
        # Give mock jobs a real unique ID just for the demo if it returned mocks
        j_id = str(uuid.uuid4()) if job.get('id').startswith('mock') else job.get('id')
        job['id'] = j_id
        
        text_to_embed = f"Title: {job.get('title')} Company: {job.get('company')} Description: {job.get('description')}"
        
        # In a real heavy system we'd batch this, but for <50 jobs loop is fine
        add_document(doc_id=j_id, text=text_to_embed, metadata={"type": "job"})
        stored_jobs.append(job)
        
    await stream_manager.emit(session_id, "THOUGHT", f"Search agent complete. Indexed {len(stored_jobs)} entries.")
    return stored_jobs
