import { useState } from "react"; 

export default function useVisualMode (initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  const transition = (transitMode, replace = false) => {
    if(!replace) {
      setMode(transitMode);
      setHistory(history => [...history, transitMode]);
    } else {
      setMode(transitMode);
      setHistory(history => {
        history.pop();
        return [...history, transitMode];
      });
    }
  };
  const back = () => {
    if (history.length > 1) {
      setHistory(history => {
        const prevHistory = [...history].slice(0, history.length-1);
        setMode(prevHistory[prevHistory.length-1]);
        return prevHistory
      });
    }
  };
  return {
    mode,
    transition,
    back
  };
}