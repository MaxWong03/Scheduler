import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const COUNT_SPOTS = "COUNT_SPOTS";
const SET_APPOINTMENT = "SET_APPOINTMENT";

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

  const rebuildDays = (days, day) => {
    return days.map(d => {
      if (d.name === day.name) return { ...d, spots: day.spots }
      else return d;
    });
  };

  const stateLookup = {
    [SET_DAY]: (state, day) => {
      return ({ ...state, day });
    },
    [SET_APPLICATION_DATA]: (state, value) => {
      const [days, appointments, interviewers] = value;
      return ({ ...state, days, appointments, interviewers });
    },
    [SET_INTERVIEW]: (state, appointments) => {
      return ({ ...state, appointments });
    },
    [COUNT_SPOTS]: (state, value) => {
      const dayObj = state.days.filter(day => day.name === state.day)[0];
      const day = { ...dayObj, spots: dayObj.spots + value };
      return ({ ...state, days: rebuildDays(state.days, day) });
    },
    [SET_APPOINTMENT]: (state, value) => {
      const { id, interview } = value;
      const appointment = {
        ...state.appointments[id],
        interview: !interview ? null : { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      return { ...state, appointments };
    }
  };

  const reducer = (state, action) => {
    return stateLookup[action.type](state, action.value) || new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  };


  const [state, dispatchState] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatchState({ type: SET_DAY, value: day });

  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const appointmentPromise = axios.get('/api/appointments');
    const interviewersPromise = axios.get('/api/interviewers');
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