const getAppointmentIDArrForDay = (state, day) => {
  const {days} = state;
  if (!days.length) return [];
  else {
    for (let d of days) {
      if (d.name === day) return d.appointments;
    }
    return [];
  }
};

const getAppointmentArr = (state, appointmentIDArr) => {
  const appointmentArr = [];
  const {appointments} = state;
  for (let id of appointmentIDArr) {
    if(appointments[id]) appointmentArr.push(appointments[id]);
  }
  return appointmentArr;
};

export function getAppointmentsForDay (state, day) {
  const appointmentIDArr = getAppointmentIDArrForDay(state, day);
  const appointmentArr = getAppointmentArr(state, appointmentIDArr);
  return appointmentArr;
}

export function getInterview (state, interview) {
  if(!interview) return null;
  else {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
    }
  }
}