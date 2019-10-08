const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_APPOINTMENT = "SET_APPOINTMENT";


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

    const getSpotsForDay = day =>
      day.appointments.length -
      day.appointments.reduce(
        (count, id) => (appointments[id].interview ? count + 1 : count),
        0
      );
    const days = state.days.map(day => {
      return day.appointments.includes(id)
        ? {
          ...day,
          spots: getSpotsForDay(day)
        }
        : day;
    });

    return { ...state, appointments, days };
  }
};

export default function reducer(state, action) {
  return stateLookup[action.type](state, action.value) || new Error(`Tried to reduce with unsupported action type: ${action.type}`);
};

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_APPOINTMENT, stateLookup };