import { useState } from "react"; 


/**
 * Create a transition function within useVisualMode that will take in a new mode and update the mode state with the new value.

This custom Hook will need to add the transition property to the object that useVisualMode returns. The property will point to a function that we implement directly in the custom Hook. Reveal the code below to see an example of this pattern.
 */

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