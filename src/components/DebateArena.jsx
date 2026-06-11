import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebateData } from '../hooks/useDebateData';

// Importing Diksha's UI components (They must be in the same folder)
import FileDropzone from './FileDropzone';
import AgentPanel from './AgentPanel';
import VerdictCard from './VerdictCard';

export default function DebateArena() {
  // 1. Bring in your engine!
  const { debateStatus, setDebateStatus, liveTurns, verdictData } = useDebateData();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      {/* AnimatePresence allows us to animate things out when they disappear */}
      <AnimatePresence mode="wait">

        {/* Condition 1: Ready to Upload */}
        {debateStatus === "ready" && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl"
          >
            {/* When the user uploads, we tell the engine to start! */}
            <FileDropzone onFileUpload={() => setDebateStatus("started")} />
          </motion.div>
        )}

        {/* Condition 2: Debate Started (The Live Stream) */}
        {debateStatus === "started" && (
          <motion.div
            key="arena"
            className="flex w-full max-w-4xl flex-col gap-4 overflow-y-auto pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Map over your engine's live array and render Diksha's bubbles */}
            {liveTurns.map((turn) => (
              <motion.div
                key={turn.turn_id}
                layout // This single word tells Framer Motion to slide old messages up smoothly!
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
          </motion.div>
        )}

        {/* Condition 3: Debate Completed (The Scoreboard) */}
        {debateStatus === "completed" && verdictData && (
          <motion.div
            key="verdict"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-5xl"
          >
            <VerdictCard
              verdict={verdictData.verdict}
              confidence={verdictData.confidence}
              summary_by_agent={verdictData.summary_by_agent}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}