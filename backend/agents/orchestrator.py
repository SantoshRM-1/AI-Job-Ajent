from backend.agents.planner_agent import create_plan
from backend.agents.job_search_agent import run_search
from backend.agents.resume_agent import analyze_resume
from backend.agents.matching_agent import match_jobs
from backend.agents.explanation_agent import generate_explanations
from backend.services.stream_manager import stream_manager
from typing import Optional, Dict, Any, List

async def orchestrate_flow(query: str, location: str, session_id: str, resume_bytes: Optional[bytes] = None) -> Dict[str, Any]:
    """
    Main orchestration function.
    Session ID is passed in from the caller (the route handler) so the SSE client
    is already subscribed to the correct session before agents start emitting.
    """
    has_resume = bool(resume_bytes)

    # Start the generator timeline
    await stream_manager.emit(session_id, "ACTION", f"Agent activated. Processing query: '{query}'")
    
    # Call Planner
    await stream_manager.emit(session_id, "THOUGHT", "Asking PlannerAgent to draft an execution plan.")
    steps = await create_plan(query, has_resume)
    await stream_manager.emit(session_id, "DECISION", f"Planner determined steps: {steps}")
    
    state = {
        "jobs": [],
        "resume_data": None
    }
    
    # Iterate steps dynamically
    for step in steps:
        if step == "search_jobs":
            state["jobs"] = await run_search(query, location, session_id)
            if not state["jobs"]:
                await stream_manager.emit(session_id, "ERROR", "No jobs found. Try a different query or location.")
                break
        
        elif step == "analyze_resume" and has_resume:
            state["resume_data"] = await analyze_resume(resume_bytes, session_id)
            if not state["resume_data"]:
                await stream_manager.emit(session_id, "ERROR", "Failed to parse resume. Please upload a valid PDF.")
                break
        
        elif step == "match_jobs" and state["jobs"] and state["resume_data"]:
            state["jobs"] = await match_jobs(state["jobs"], state["resume_data"], location, session_id)
            
        elif step == "generate_explanations" and state["jobs"] and state["resume_data"]:
            state["jobs"] = await generate_explanations(state["jobs"], state["resume_data"], session_id)
            
        else:
            await stream_manager.emit(session_id, "THOUGHT", f"Skipping step '{step}' — prerequisites not met.")
            
    # Pipeline completion
    await stream_manager.emit(session_id, "ACTION", "Pipeline complete. Sending results to frontend.")
    await stream_manager.close_stream(session_id)
    
    return {
        "session_id": session_id,
        "results": state["jobs"]
    }

