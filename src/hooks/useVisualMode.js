import { useState } from "react"; 

export default function useVisualMode (initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  const transition = (transitMode, replace = false) => {
    if(!replace) {
      setMode(transitMode);
      setHistory([...history, transitMode]);
    } else {
      setMode(transitMode);
      history.pop()
      setHistory([...history, transitMode]);
    }
  };
  const back = () => {
    if (history.length > 1) {
      const prevHistory = [...history].slice(0, history.length-1);
      setHistory(prevHistory);
      setMode(prevHistory[prevHistory.length-1]);
    }
  };
  return {
    mode,
    transition,
    back
  };
}