import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Building, ChevronDown, CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  // Safely grab AI values
  const score = job.match_score || 0;
  const reasoning = job.reasoning;
  const matched = job.matched_skills || [];
  const missing = job.missing_skills || [];
  const confidence = job.confidence;
  const interviews = job.interview_questions || [];

  const getScoreColor = (sc) => {
    if (sc >= 80) return "bg-emerald-500";
    if (sc >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 w-full"
    >
      {/* Header bar -> Score indicator */}
      <div className="h-1.5 w-full bg-gray-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn("h-full", getScoreColor(score))} 
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5 font-medium text-gray-300">
                <Building className="w-4 h-4" /> {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {job.location || 'Remote'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-3xl font-black text-white">{score}<span className="text-lg text-gray-500 font-medium">%</span></div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Match</span>
            {confidence === "Uncertain match" && (
              <span className="mt-2 flex items-center gap-1 text-[10px] uppercase font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                <AlertCircle className="w-3 h-3" /> Borderline
              </span>
            )}
          </div>
        </div>

        {/* Explainable AI snippet */}
        {reasoning && (
          <div className="mt-5 p-4 rounded-lg bg-blue-900/10 border border-blue-500/20 shadow-inner">
            <p className="text-sm text-blue-200 leading-relaxed font-medium">✨ {reasoning}</p>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-6 flex flex-wrap gap-3 items-center justify-between border-t border-gray-800 pt-5">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? 'Hide Breakdown' : 'View Match Details'}
            <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowQuestions(!showQuestions)}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> Prepare
            </button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all shadow-lg">
              Apply
            </button>
          </div>
        </div>

        {/* Expandable Match Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-5">
                {/* Embedded Score Breakdown */}
                {job.breakdown && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-950/50 p-4 rounded-xl border border-gray-800/60">
                     <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Vector</div>
                        <div className="text-sm font-bold text-gray-300">{job.breakdown.embedding}%</div>
                     </div>
                     <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">LLM</div>
                        <div className="text-sm font-bold text-gray-300">{job.breakdown.llm}%</div>
                     </div>
                     <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Heuristics</div>
                        <div className="text-sm font-bold text-gray-300">{job.breakdown.rule}%</div>
                     </div>
                     <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Recency</div>
                        <div className="text-sm font-bold text-gray-300">{job.breakdown.recency}%</div>
                     </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matched.length ? matched.map(s => (
                        <span key={s} className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {s}
                        </span>
                      )) : <span className="text-sm text-gray-600 italic">None determined</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                      <XCircle className="w-4 h-4 text-red-500" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {missing.length ? missing.map(s => (
                        <span key={s} className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                          {s}
                        </span>
                      )) : <span className="text-sm text-gray-600 italic">No major gaps</span>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {showQuestions && interviews.length > 0 && (
            <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="mt-4 p-5 rounded-xl bg-purple-900/10 border border-purple-500/20"
            >
              <h4 className="text-sm font-bold text-purple-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                 <HelpCircle className="w-4 h-4" /> Likely Interview Questions
              </h4>
              <ul className="space-y-3">
                {interviews.map((q, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-purple-400 font-bold mt-0.5">{i+1}.</span> 
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
