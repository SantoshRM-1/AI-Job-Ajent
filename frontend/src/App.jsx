import { useState, useEffect, useRef } from "react";
import "./App.css";

// ── Icons (inline SVG) ──────────────────────────────────────────────────────
const IconBrain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5a2 2 0 0 0 2 2h.5a2.5 2.5 0 0 1 0 5h-.5a2 2 0 0 0-2 2v.5a2.5 2.5 0 0 1-5 0V12a2 2 0 0 0-2-2H7a2.5 2.5 0 0 1 0-5h.5a2 2 0 0 0 2-2V2z" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const IconLoader = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 animate-spin-custom">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-emerald-500">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

// ── Score badge color ────────────────────────────────────────────────────────
function scoreMeta(score) {
  if (score >= 80) return { label: "Excellent", cls: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" };
  if (score >= 60) return { label: "Good",      cls: "bg-blue-100 text-blue-700 ring-1 ring-blue-200" };
  if (score >= 40) return { label: "Fair",      cls: "bg-amber-100 text-amber-700 ring-1 ring-amber-200" };
  return                 { label: "Low",        cls: "bg-red-100 text-red-600 ring-1 ring-red-200" };
}

// ── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-3.5 w-1/3" />
        </div>
        <div className="skeleton h-7 w-16 rounded-full" />
      </div>
      <div className="skeleton h-3.5 w-1/4" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

// ── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, index, isBest }) {
  const meta = scoreMeta(job.score ?? 0);
  return (
    <div
      className={`job-card animate-fade-in-up bg-white rounded-2xl p-6 shadow-sm border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        isBest ? "border-violet-300 ring-2 ring-violet-100" : "border-slate-100"
      }`}
      style={{ animationDelay: `${index * 0.07}s`, animationFillMode: "both" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-violet-600 text-white px-2 py-0.5 rounded-full">
                <IconStar /> Best Match
              </span>
            )}
            <h3 className="text-base font-semibold text-slate-900 leading-snug">{job.title}</h3>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <IconBuilding /> {job.company}
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <IconMapPin /> {job.location}
            </span>
          </div>
        </div>
        {/* Score badge */}
        <div className={`flex flex-col items-center px-3 py-1.5 rounded-xl ${meta.cls} shrink-0`}>
          <span className="text-lg font-bold leading-none">{job.score ?? 0}%</span>
          <span className="text-[10px] font-medium mt-0.5">{meta.label}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-50 my-3" />

      {/* Skills */}
      <div className="space-y-2">
        {job.matched_skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-slate-400 font-medium w-24 shrink-0">Matched skills</span>
            {job.matched_skills.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 font-medium">
                {s}
              </span>
            ))}
          </div>
        )}
        {job.missing_skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-slate-400 font-medium w-24 shrink-0">Missing skills</span>
            {job.missing_skills.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 ring-1 ring-red-200 font-medium">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Thought Panel ─────────────────────────────────────────────────────────────
const THOUGHT_SEQUENCE = [
  { text: "Parsing your query...",          icon: "brain",  done: false },
  { text: "Analyzing resume...",             icon: "loader", done: false },
  { text: "Searching job database...",       icon: "loader", done: false },
  { text: "Matching skills to listings...", icon: "loader", done: false },
  { text: "Ranking by relevance...",         icon: "loader", done: false },
  { text: "Results ready!",                 icon: "check",  done: true  },
];

function ThoughtPanel({ loading, thoughts, hasSearched }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (loading) {
      setVisibleCount(0);
      let count = 0;
      timerRef.current = setInterval(() => {
        count += 1;
        setVisibleCount(count);
        if (count >= THOUGHT_SEQUENCE.length) clearInterval(timerRef.current);
      }, 600);
    } else {
      clearInterval(timerRef.current);
      if (hasSearched) setVisibleCount(THOUGHT_SEQUENCE.length);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, hasSearched]);

  const displayedThoughts = thoughts && thoughts.length > 0
    ? thoughts.map((t, i) => ({ text: t, icon: i === thoughts.length - 1 ? "check" : "loader", done: i === thoughts.length - 1 }))
    : THOUGHT_SEQUENCE.slice(0, loading ? visibleCount : (hasSearched ? THOUGHT_SEQUENCE.length : 0));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-fit sticky top-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-100 text-violet-600">
          <IconBrain />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">AI Thinking</p>
          <p className="text-xs text-slate-400">Step-by-step reasoning</p>
        </div>
        {loading && (
          <span className="ml-auto flex gap-1 items-center">
            {[0,1,2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500"
                style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="px-5 py-4 space-y-3 min-h-[180px]">
        {!hasSearched && !loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
            <span className="text-3xl">🔍</span>
            <p className="text-sm text-slate-400">Search for jobs to see AI reasoning</p>
          </div>
        ) : (
          displayedThoughts.map((step, i) => {
            const isActive = loading && i === displayedThoughts.length - 1;
            const isDone = !loading || step.done || i < displayedThoughts.length - 1;
            return (
              <div key={i} className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                  isDone ? "bg-emerald-50 text-emerald-500" : "bg-violet-50 text-violet-500"
                }`}>
                  {isDone ? <IconCheck /> : <IconLoader />}
                </span>
                <span className={`text-sm thought-line ${isActive ? "text-slate-700 font-medium" : isDone ? "text-slate-500" : "text-slate-700"}`}
                  style={{ animationDelay: `${i * 0.05}s`, animationDuration: `${Math.max(0.4, step.text.length * 0.02)}s` }}>
                  {step.text}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [query, setQuery]       = useState("");
  const [resume, setResume]     = useState("");
  const [jobs, setJobs]         = useState([]);
  const [error, setError]       = useState(null); // ✅ NEW
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showResume, setShowResume]   = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async () => {
    if (!query.trim()) { inputRef.current?.focus(); return; }
    setLoading(true);
    setHasSearched(true);
    setJobs([]);
    setThoughts([]);
    setError(null); // ✅ Reset error
    try {
      const res = await fetch("http://localhost:8000/smart-job-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          resume_text: resume || "I know Python, SQL and Machine Learning",
        }),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        setThoughts(data.thoughts || []);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to connect to the backend server. Make sure the API is running and CORS is allowed.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const bestIdx = jobs.length > 0
    ? jobs.reduce((best, j, i) => ((j.score ?? 0) > (jobs[best].score ?? 0) ? i : best), 0)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-600 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
              </svg>
            </span>
            <span className="font-semibold text-slate-800 text-sm tracking-tight">AI Job Search Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Powered by AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pb-24">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <div className="text-center pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            AI-powered matching engine
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
            Find jobs that actually<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">
              match your skills
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Describe what you're looking for — our AI searches, analyzes, and ranks jobs for you in seconds.
          </p>
        </div>

        {/* ── Search ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8 max-w-3xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <IconSearch />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search jobs like Python Developer Bangalore…"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm px-6 rounded-xl transition-all duration-150 shadow-sm shadow-violet-200"
            >
              {loading ? <IconLoader /> : <IconSearch />}
              {loading ? "Searching…" : "Search"}
            </button>
          </div>

          {/* Resume toggle */}
          <div className="mt-4">
            <button
              onClick={() => setShowResume(!showResume)}
              className="text-xs text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-1.5"
            >
              <IconUpload />
              {showResume ? "Hide resume" : "Add your resume for better matching (optional)"}
            </button>
            {showResume && (
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                rows={4}
                placeholder="Paste your resume or key skills here e.g. Python, React, 3 years experience in ML…"
                className="mt-3 w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none transition-all"
              />
            )}
          </div>
        </div>

        {/* ── Two-column layout ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* Left — Job Results */}
          <div className="space-y-4">
            {/* Results header */}
            {(hasSearched || loading) && (
              <div className="flex items-center justify-between mb-1 animate-fade-in">
                <p className="text-sm font-medium text-slate-700">
                  {loading ? "Finding jobs for you…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
                </p>
                {!loading && jobs.length > 0 && (
                  <span className="text-xs text-slate-400">{query}</span>
                )}
              </div>
            )}

            {/* Skeleton loading */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Actual results */}
            {!loading && jobs.map((job, i) => (
              <JobCard key={i} job={job} index={i} isBest={i === bestIdx} />
            ))}

            {/* Error state */}
            {error && !loading && (
              <div className="bg-red-50 rounded-2xl border border-red-100 p-8 text-center animate-fade-in shadow-sm">
                <div className="text-3xl mb-3">⚠️</div>
                <p className="text-red-700 font-medium">Search Failed</p>
                <p className="text-sm text-red-500 mt-1 max-w-sm mx-auto">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && hasSearched && jobs.length === 0 && !error && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center animate-fade-in">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-slate-700 font-medium">No jobs found for "{query}"</p>
                <p className="text-sm text-slate-400 mt-1">Google Jobs might not have a box for this specific query. Try a more common job title.</p>
              </div>
            )}

            {/* Initial empty state */}
            {!loading && !hasSearched && !error && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
                <div className="text-5xl mb-4">✨</div>
                <p className="text-slate-700 font-medium text-lg">Ready to find your next role?</p>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                  Enter a job title and location above — the AI will search, analyze, and rank jobs that match your profile.
                </p>
              </div>
            )}
          </div>

          {/* Right — AI Thinking Panel */}
          <ThoughtPanel loading={loading} thoughts={thoughts} hasSearched={hasSearched} />
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white/60 backdrop-blur py-4 text-center text-xs text-slate-400">
        AI Job Search Agent &mdash; Powered by AI &amp; built with ❤️
      </footer>
    </div>
  );
}

export default App;