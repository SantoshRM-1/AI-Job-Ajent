import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Activity, CheckSquare, AlertTriangle, Wifi } from 'lucide-react';

const iconMap = {
  THOUGHT: <BrainCircuit className="w-4 h-4 text-purple-400" />,
  ACTION: <Activity className="w-4 h-4 text-blue-400" />,
  DECISION: <CheckSquare className="w-4 h-4 text-green-400" />,
  ERROR: <AlertTriangle className="w-4 h-4 text-red-400" />
};

export default function AgentThoughtPanel({ sessionId, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    setMessages([]);
    setIsDone(false);
    setConnectionError(false);

    // Connect to SSE Endpoint
    const eventSource = new EventSource(`http://localhost:8000/agent-stream/${sessionId}`);

    // Set a safety timeout — if stream doesn't close in 120s, trigger complete anyway
    const timeout = setTimeout(() => {
      eventSource.close();
      setIsDone(true);
      if (onComplete) onComplete();
    }, 120000);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'END') {
          clearTimeout(timeout);
          eventSource.close();
          setIsDone(true);
          if (onComplete) onComplete();
          return;
        }
        setMessages(prev => [...prev, data]);
      } catch (e) {
        console.error("SSE parse error", e);
      }
    };

    eventSource.onerror = (err) => {
      clearTimeout(timeout);
      console.error("SSE Connection Error", err);
      eventSource.close();
      setConnectionError(true);
      setIsDone(true);
      // Still call onComplete so the UI unlocks and tries to fetch results
      if (onComplete) onComplete();
    };

    return () => {
      clearTimeout(timeout);
      eventSource.close();
    };
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!sessionId && messages.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg overflow-hidden">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
        <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse" />
        <h3 className="text-gray-200 font-semibold tracking-wide">Live Agent Reasoning</h3>
        <div className="ml-auto flex items-center gap-1.5">
          {connectionError ? (
            <span className="text-xs text-red-400 font-mono flex items-center gap-1"><Wifi className="w-3 h-3" /> Connection Error</span>
          ) : isDone ? (
            <span className="text-xs text-green-400 font-mono">✓ Complete</span>
          ) : (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-gray-400 font-mono">Stream Active</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 bg-gray-800/40 p-3 rounded-lg border border-gray-700/50"
            >
              <div className="mt-0.5 p-1.5 bg-gray-900 rounded-md ring-1 ring-white/5 shadow-sm flex-shrink-0">
                {iconMap[msg.type] || <Activity className="w-4 h-4 text-gray-400" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-500 mb-0.5 uppercase tracking-wider">{msg.type}</span>
                <span className="text-sm text-gray-200 leading-relaxed font-mono break-words">{msg.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator — only show while still processing */}
        {!isDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1.5 items-center p-2 pl-4"
          >
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }} />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
