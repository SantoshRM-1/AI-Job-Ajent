import React, { useState, useRef } from 'react';
import SearchBar from './components/SearchBar';
import AgentThoughtPanel from './components/AgentThoughtPanel';
import JobCard from './components/JobCard';
import SkillGapPanel from './components/SkillGapPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const currentSessionRef = useRef(null);

  const handleSearch = async ({ query, location, file }) => {
    setIsProcessing(true);
    setJobs([]);
    setSessionId(null);
    setError(null);

    const formData = new FormData();
    formData.append('query', query);
    formData.append('location', location || '');
    if (file) {
      formData.append('resume', file);
    }

    try {
      const response = await fetch(`${API_BASE}/match-jobs`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend error ${response.status}: ${errText}`);
      }

      const data = await response.json();

      if (data.session_id) {
        currentSessionRef.current = data.session_id;
        setSessionId(data.session_id);
      } else {
        throw new Error("No session_id returned from backend.");
      }
    } catch (e) {
      console.error("Match jobs API error:", e);
      setError(`Could not connect to the AI backend. Is uvicorn running on port 8000? (${e.message})`);
      setIsProcessing(false);
    }
  };

  const handleStreamComplete = async () => {
    const sid = currentSessionRef.current;
    if (!sid) {
      setIsProcessing(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/jobs/results/${sid}`);
      if (!res.ok) throw new Error(`Results fetch failed: ${res.status}`);
      const json = await res.json();
      setJobs(json.jobs || []);
    } catch (e) {
      console.error("Failed to fetch finalized jobs", e);
      setError("AI processing completed but failed to load results. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">

      {/* Decorative gradient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 bg-gradient-radial from-blue-600 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 bg-gradient-radial from-purple-600 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4 inline-block">
              AI Powered Job Matching
            </span>
            <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
              Future<span className="text-white">Role</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 mt-6 font-medium">
              Find the perfect job match using hybrid intelligence scoring. Upload your resume to see skill gaps, mock interview questions, and explainable AI insights.
            </p>
          </motion.div>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isProcessing} />

        {/* Global Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 max-w-4xl mx-auto flex items-start gap-3 bg-red-900/20 border border-red-500/30 text-red-300 rounded-xl p-4 text-sm"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AgentThoughtPanel
          sessionId={sessionId}
          onComplete={handleStreamComplete}
        />

        <AnimatePresence>
          {jobs.length > 0 && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 w-full"
            >
              <SkillGapPanel jobs={jobs} />

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white">Your Best Matches</h2>
                <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded text-white">{jobs.length} Found</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job, idx) => (
                  <JobCard key={job.id || idx} job={job} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}