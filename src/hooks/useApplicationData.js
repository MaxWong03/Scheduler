import { useState, useEffect, useReducer } from "react"; 
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData () {
  const bookInterview = (id, interview) => {
    // console.log(id, interview);
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
        if (response.status === 204) dispatchState({type: SET_INTERVIEW, value: appointments});
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
        if (response.status === 204) dispatchState({type: SET_INTERVIEW, value: appointments});
      })
  };

  const stateLookup = {
    [SET_DAY]: (state, day) => {
      return ({...state, day});
    },
    [SET_APPLICATION_DATA]: (state, value) => {
      const [days, appointments, interviewers] = value;
      return ({...state, days, appointments, interviewers});
    },
    [SET_INTERVIEW]: (state, appointments) => {
      return ({...state, appointments});
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

  const setDay = day => dispatchState({type: SET_DAY, value: day});
  
  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const appointmentPromise = axios.get('/api/appointments');
    const interviewersPromise = axios.get('/api/interviewers');
    Promise.all([
      daysPromise, 
      appointmentPromise, 
      interviewersPromise])
      .then(([
        {data: days},
        {data: appointments},
        {data: interviewers}
      ]) => {
        dispatchState({type: SET_APPLICATION_DATA, value: [days, appointments, interviewers]});
      });
  },[]);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};