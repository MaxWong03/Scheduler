import React from 'react';

import "./styles.scss";
import Show from "./Show";
import Empty from "./Empty";
import Header from "./Header";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


export default function Appointment(props) {
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition("SHOW"))
      .catch(() => transition(ERROR_SAVE, true));
  };

  const destroy = () => {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  const interview = props.interview;
  const {mode, transition, back} = useVisualMode(interview ? SHOW : EMPTY);
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={(event) => {transition(CREATE)}}/>}
      {mode === SHOW && (
        <Show 
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => {transition(CONFIRM)}}
          onEdit={() => {transition(EDIT)}}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      { 
        mode === EDIT && (
        <Form
          name={interview.student}
          interviewer={interview.interviewer ? interview.interviewer.id : 0}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === CONFIRM && (
        <Confirm 
          message={"Are you sure you would like to delete?"} 
          onConfirm={() => destroy()} 
          onCancel={back}
        />
      )}
      {mode === SAVING && (<Status message={"Saving"}/>)}
      {mode === DELETING && (<Status message={"Deleting"}/>)}
      {mode === ERROR_SAVE && (<Error message={"Can not save appointment"} onClose={back}/>)}
      {mode === ERROR_DELETE && (<Error message ={"Can not cancel appointment"} onClose={back}/>)}
    </article>
  );
}
