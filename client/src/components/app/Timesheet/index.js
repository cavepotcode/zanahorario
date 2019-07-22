import React, { useReducer } from 'react';
import { Form, Formik } from 'formik';
import useStoreon from 'storeon/react';
import CalendarHeader from './CalendarHeader';
import ProjectLine from './ProjectLine';
import NewProject from './NewProject';
import { reducer, initialState } from './reducer';
import styles from './styles.module.scss';
import { getCompleteWeek, generateInitialEntries, getTimeChanges, updateEntries } from './helper';
import ValueSlider from '../../ui/ValueSlider';
import Button from '../../ui/Button';
import api from '../../../utils/api';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';

export default function Timesheet() {
  const { addNotification } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { dispatch: fetchProjects, projects, user } = useStoreon('projects', 'user');

  React.useEffect(() => {
    fetchProjects('projects/fetch');
  }, [fetchProjects]);

  React.useEffect(() => {
    async function fetch() {
      try {
        const { data: entries } = await api.get(apiUrls.timesheets.user(state.date));
        dispatch({ type: 'set_entries', entries });

        const timesheet = generateInitialEntries(state.date, entries, projects.items);
        dispatch({ type: 'set_timesheet', timesheet, projects: projects.items });
      } catch (err) {
        addNotification(err.message);
      }
    }

    if (projects.items.length) {
      fetch();
    }
  }, [state.date, projects.items, addNotification]);

  if (!state.ready) {
    return null;
  }

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={state.timesheet}
      validateOnBlur
      validateOnChange={false}
      render={props => (
        <Form className={styles.container}>
          <header>
            <ValueSlider
              disabled={props.dirty}
              onPrev={() => handleMonthChange(-1)}
              onNext={() => handleMonthChange(1)}
              value={state.monthLabel}
            />
            <ValueSlider
              disabled={props.dirty}
              onPrev={() => handleWeekChange(-7)}
              onNext={() => handleWeekChange(7)}
              value="WEEK"
            />
          </header>
          <CalendarHeader startDate={state.date} />
          {Object.keys(state.timesheet.hours).map(projectId => (
            <ProjectLine
              errors={props.errors.hours ? props.errors.hours[projectId] || {} : {}}
              key={projectId}
              project={projects.items.find(p => p.id === Number(projectId))}
              startDate={state.date}
            />
          ))}
          {state.addingProject && (
            <NewProject
              projects={state.remainingProjects}
              selectedIds={Object.keys(state.timesheet.hours).map(Number)}
              onSelect={project => handleNewProject(project, props)}
            />
          )}
          <footer>
            {state.remainingProjects.length > 0 && (
              <Button onClick={handleAddProject} type="button">
                Add Project
              </Button>
            )}
            <Button type="submit" disabled={!props.isValid || (props.isValid && !props.dirty)}>
              Save
            </Button>
          </footer>
        </Form>
      )}
    />
  );

  function handleNewProject(project, props) {
    const timesheet = {
      hours: {
        ...props.values.hours,
        [project.id]: getCompleteWeek(state.date, [])
      }
    };
    if (props.dirty) {
      props.setValues(timesheet);
    } else {
      props.resetForm(timesheet);
    }
    dispatch({ type: 'set_timesheet', timesheet, projects: projects.items });
  }

  async function handleSubmit(values, actions) {
    debugger;
    const changes = getTimeChanges(user.userId, state.entries, values.hours);
    if (changes.length) {
      const { meta } = await api.post(apiUrls.timesheets.index, { entries: changes });

      const message = meta.code ? meta.message : 'Changes saved correctly';
      addNotification(message);

      if (!meta.code) {
        actions.resetForm(values);
        const newEntries = updateEntries(state.entries, changes);
        dispatch({ type: 'set_entries', entries: newEntries });
      }
    } else {
      actions.resetForm(values);
    }
  }

  function handleAddProject() {
    dispatch({ type: 'add_project' });
  }

  function handleMonthChange(increment) {
    const newDate = new Date(state.date);
    newDate.setMonth(state.date.getMonth() + increment);
    dispatch({ type: 'change_date', date: newDate });
  }

  function handleWeekChange(increment) {
    const newDate = new Date(state.date);
    newDate.setDate(state.date.getDate() + increment);
    dispatch({ type: 'change_date', date: newDate });
  }
}
