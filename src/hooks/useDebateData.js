import { useState, useCallback, useEffect, useRef } from 'react';

export function useDebateData() {
  const [debateStatus, setDebateStatus] = useState("ready"); 
  const [liveTurns, setLiveTurns] = useState([]);
  const [verdictData, setVerdictData] = useState(null);
  const [error, setError] = useState(null);

  // We use a ref to hold onto the active connection so we can kill it later if needed
  const eventSourceRef = useRef(null);

  const startDebate = useCallback((debateId) => {
    setDebateStatus("started");
    setLiveTurns([]);
    setVerdictData(null);
    setError(null);

    // Clean up any existing connection before starting a new one
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // 1. Connect to backend using Environment Variables (Fallback to localhost for safety)
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "https://convergenceai-backend.onrender.com";
    const eventSource = new EventSource(`${baseUrl}/api/stream-debate/${debateId}`);
    
    // Store the connection in our ref
    eventSourceRef.current = eventSource;

    // 2. Catch live AI turns
    eventSource.addEventListener('debate_turn', (event) => {
      const turnData = JSON.parse(event.data);
      setLiveTurns((prevTurns) => [...prevTurns, turnData]);
    });

    // 3. Catch the final verdict
    eventSource.addEventListener('debate_end', (event) => {
      const finalData = JSON.parse(event.data);
      setVerdictData(finalData);
      setDebateStatus("completed"); 
      eventSource.close();
      eventSourceRef.current = null;
    });

    // 4. Handle connection drops safely
    eventSource.addEventListener('error', () => {
      setError("Connection to the AI server was lost.");
      setDebateStatus("ready"); 
      eventSource.close();
      eventSourceRef.current = null;
    });

  }, []);

  const resetDebate = useCallback(() => {
    // Kill any active connection just in case
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    // Reset all state back to zero
    setLiveTurns([]);
    setVerdictData(null);
    setError(null);
    setDebateStatus("ready"); 
  }, []);

  // THE RESTORED EFFECT: 
  // This guarantees the connection dies if the component completely unmounts
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    debateStatus,
    liveTurns,
    verdictData,
    error,
    startDebate,
    resetDebate
  };
}