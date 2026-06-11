import { useState, useEffect } from 'react';
import mockData from '../mocks/mockDebateData.json';

export function useDebateData() {
  // 1. Create our state variables (the memory of our engine)
  const [debateStatus, setDebateStatus] = useState("ready"); // Can be "ready", "started", or "completed"
  const [liveTurns, setLiveTurns] = useState([]);
  const [verdictData, setVerdictData] = useState(null);

  // 2. The Engine Timer (Simulating the live backend)
  useEffect(() => {
    // If the debate hasn't started yet, do nothing.
    if (debateStatus !== "started") return;

    let currentTurnIndex = 0;
    const totalTurns = mockData.turns.length;

    // Start a timer that runs every 3 seconds (3000 milliseconds)
    const timer = setInterval(() => {
      if (currentTurnIndex < totalTurns) {
        // We have a turn! Add it to our live chat array.
        const nextTurn = mockData.turns[currentTurnIndex];
        setLiveTurns((previousTurns) => [...previousTurns, nextTurn]);
        currentTurnIndex++;
      } else {
        // No more turns left. The debate is over!
        setDebateStatus("completed");
        setVerdictData(mockData.finalVerdict);
        clearInterval(timer); // Stop the timer
      }
    }, 3000);

    // Cleanup function: stops the timer if we leave the page
    return () => clearInterval(timer);
  }, [debateStatus]); // This tells React to restart this effect if debateStatus changes

  // 3. Export these variables so your visual Arena can use them
  return {
    debateStatus,
    setDebateStatus,
    liveTurns,
    verdictData
  };
}