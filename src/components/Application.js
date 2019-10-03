import React, { useState, Fragment, useEffect } from "react";

import axios from "axios";

import DayList from "./DayList";

import Appointment from "./Appointment/index";

import {getAppointmentsForDay, getInterview, getInterviewersForDay} from "../helpers/selectors"

import "components/Application.scss";

export default function Application(props) {
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

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay}/>
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        <Fragment>
        { getAppointmentsForDay(state, state.day).map(appointment => (
          <Appointment
            key={appointment.id}
            id={appointment.id}
            time={appointment.time}
            interview={getInterview(state, appointment.interview)}
            interviewers={getInterviewersForDay(state, state.day)}
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
        />))}
        <Appointment key={"last"} time={"5pm"} />
        </Fragment>
      </section>
    </main>
  );
}
