import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, { SET_APPLICATION_DATA, SET_DAY, SET_APPOINTMENT, SET_INTERVIEW, COUNT_SPOTS } from "../reducers/application";

export default function useApplicationData() {
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(response => {
        if (response.status === 204) {
          dispatchState({ type: SET_INTERVIEW, value: appointments });
          if (!state.appointments[id].interview) {
            dispatchState({ type: COUNT_SPOTS, value: -1 });
          }

        }
      })
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(response => {
        if (response.status === 204) {
          dispatchState({ type: SET_INTERVIEW, value: appointments });
          dispatchState({ type: COUNT_SPOTS, value: 1 });
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
        dispatchState({ type: SET_APPOINTMENT, value: { id, interview } });
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