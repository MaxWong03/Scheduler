import { useState, useEffect } from "react"; 
import axios from "axios";

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
        if (response.status === 204) setState({...state, appointments});
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
        if (response.status === 204) setState({...state, appointments})
      })
  };

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});
  
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
        setState(prev => ({...prev, days, appointments, interviewers}));
      });
  },[]);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};