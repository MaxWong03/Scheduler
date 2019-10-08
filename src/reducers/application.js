const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const COUNT_SPOTS = "COUNT_SPOTS";
const SET_APPOINTMENT = "SET_APPOINTMENT";

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

export default function reducer (state, action) {
  return stateLookup[action.type](state, action.value) || new Error(`Tried to reduce with unsupported action type: ${action.type}`);
};

export {SET_DAY ,SET_APPLICATION_DATA ,SET_INTERVIEW ,COUNT_SPOTS ,SET_APPOINTMENT, stateLookup};