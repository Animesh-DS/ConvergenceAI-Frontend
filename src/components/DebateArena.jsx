import React, { useState } from 'react'; // <-- Added useState here
import { motion, AnimatePresence } from 'framer-motion';
import { useDebateData } from '../hooks/useDebateData'; 
import ProblemInput from './ProblemInput';
import AgentPanel from './AgentPanel';
import VerdictCard from './VerdictCard';

export default function DebateArena() {
const { debateStatus, liveTurns, verdictData, error, startDebate, resetDebate } = useDebateData();  
  // <-- Added state to track when the file is actively uploading
  const [isUploading, setIsUploading] = useState(false);

  // <-- THE REAL UPLOAD BRIDGE
  // THE NEW TEXT-TO-FILE BRIDGE
  const handleTextSubmit = async (userInputString) => {
    setIsUploading(true);
    
    // 1. THE MAGIC: Convert the string into a virtual text file
    const virtualFile = new File([userInputString], "debate_topic.txt", { type: "text/plain" });

    // 2. Send it exactly like we did before!
    const formData = new FormData();
    formData.append("file", virtualFile);

    try {
      const uploadResponse = await fetch("https://convergenceai-backend.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Step 1 Failed: Could not upload file.");
      const uploadData = await uploadResponse.json();
      
      if (!uploadData.problem_id) throw new Error("Backend did not return a problem_id.");
      const problemId = uploadData.problem_id;

      const startResponse = await fetch("https://convergenceai-backend.onrender.com/api/start-debate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem_id: problemId }), 
      });

      if (!startResponse.ok) throw new Error("Step 2 Failed: Could not start debate.");
      const startData = await startResponse.json();

      if (!startData.debate_id) throw new Error("Backend did not return a debate_id.");
      const debateId = startData.debate_id;

      startDebate(debateId);

    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      
      {/* Show errors if the backend disconnects */}
      {error && (
        <div className="absolute top-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm z-50">
          <p className="font-bold">Connection Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* AnimatePresence allows us to animate things out when they disappear */}
      <AnimatePresence mode="wait">

        {/* Condition 1: Ready to Upload */}
        {debateStatus === "ready" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-3xl"
          >
            {isUploading ? (
               <div className="text-center text-gray-500 animate-pulse font-bold text-xl p-20">
                 Transmitting dilemma to AI Agents...
               </div>
            ) : (
               <ProblemInput onSubmit={handleTextSubmit} /> 
            )}
          </motion.div>
        )}

        {/* Condition 2: Debate Started (The Live Stream) */}
        {debateStatus === "started" && (
          <motion.div
            key="arena"
            className="w-full max-w-5xl flex-1 min-h-0 overflow-y-auto pb-10 flex flex-col items-center"            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {liveTurns.map((turn, index) => (
              <motion.div
                key={turn.turn_id || index}
                layout // Smoothly slides old messages up!
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AgentPanel
                  agent={turn.agent}
                  message={turn.message}
                  timestamp={turn.timestamp}
                  targets={turn.targets}
                />
              </motion.div>
            ))}
            
            {/* Loading indicator while waiting for the next agent */}
            <motion.div 
              layout
              className="text-center text-gray-400 font-medium py-4 animate-pulse"
            >
              Agents are analyzing...
            </motion.div>
          </motion.div>
        )}

        {/* Condition 3: Debate Completed (The Scoreboard) */}
        {debateStatus === "completed" && verdictData && (
          <motion.div
            key="verdict"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-5xl overflow-y-auto pb-10 flex flex-col items-center"
          >
            <VerdictCard
              verdict={verdictData.verdict}
              confidence={verdictData.confidence}
              summary_by_agent={verdictData.summary_by_agent}
            />
            
            {/* 2. ADD THIS NEW BUTTON SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }} // Shows up slightly after the verdict card
              className="mt-8"
            >
              <button 
                onClick={resetDebate}
                className="group flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Analyze Another Case
              </button>
            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}