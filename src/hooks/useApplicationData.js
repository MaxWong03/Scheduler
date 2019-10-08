import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, { SET_APPLICATION_DATA, SET_DAY, SET_INTERVIEW} from "../reducers/application";

export default function useApplicationData() {
  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, {interview})
      .then(response => {
        if (response.status === 204) {
          dispatchState({ type: SET_INTERVIEW, value: {id, interview} });
        }
      })
  };

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(response => {
        if (response.status === 204) {
          dispatchState({ type: SET_INTERVIEW, value: {id, interview: null} });
        }
      })
  };

  const [state, dispatchState] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatchState({ type: SET_DAY, value: day });

  useEffect(() => {
    const daysPromise = axios.get(`${process.env.REACT_APP_API_URL}/api/days`);
    const appointmentPromise = axios.get(`${process.env.REACT_APP_API_URL}/api/appointments`);
    const interviewersPromise = axios.get(`${process.env.REACT_APP_API_URL}/api/interviewers`);
    const apiSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    Promise.all([
      daysPromise,
      appointmentPromise,
      interviewersPromise])
      .then(([
        { data: days },
        { data: appointments },
        { data: interviewers }
      ]) => {
        dispatchState({ type: SET_APPLICATION_DATA, value: [days, appointments, interviewers] });
      });
    apiSocket.onopen = (event) => {
      apiSocket.send("ping");
    };
    apiSocket.onmessage = (event) => {
      const { type, id, interview } = JSON.parse(event.data);
      if (type === SET_INTERVIEW) {
        dispatchState({ type: SET_INTERVIEW, value: { id, interview } });
      }
    }
    return () => apiSocket.close();
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};