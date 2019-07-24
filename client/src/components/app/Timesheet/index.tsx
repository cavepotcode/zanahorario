import React, { useReducer } from 'react';
import { Form, Formik, FormikProps} from 'formik';
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
import { lastMonday } from '../../../utils/date';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';
import { IProject, ITimesheet } from './interfaces';

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
      enableReinitialize
      initialValues={state.timesheet}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange={false}
      render={(props: FormikProps<ITimesheet>) => (
        <Form className={styles.container}>
          <header>
            <ValueSlider
              disabled={props.dirty}
              onPrev={() => handleMonthChange(-1, props.resetForm)}
              onNext={() => handleMonthChange(1, props.resetForm)}
              value={state.monthLabel}
            />
            <ValueSlider
              disabled={props.dirty}
              onPrev={() => handleWeekChange(-7, props.resetForm)}
              onNext={() => handleWeekChange(7, props.resetForm)}
              value="WEEK"
            />
          </header>
          <CalendarHeader startDate={state.date} />
          {Object.keys(state.timesheet.hours).map(projectId => (
            <ProjectLine
              errors={props.errors.hours ? props.errors.hours[Number(projectId)] || {} : {}}
              key={projectId}
              project={projects.items.find((p: IProject) => p.id === Number(projectId))}
              startDate={state.date}
            />
          ))}
          {state.addingProject && (
            <NewProject
              projects={state.remainingProjects}
              onSelect={(project: IProject) => handleNewProject(project, props)}
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

  function handleNewProject(project: IProject, props: FormikProps<ITimesheet>) {
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

  async function handleSubmit(values: ITimesheet, actions: any) {
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

  function handleMonthChange(increment: number, resetForm: Function) {
    const newDate = new Date(state.date);
    newDate.setMonth(state.date.getMonth() + increment);
    dispatch({ type: 'change_date', date: lastMonday(newDate) });
    resetForm({});
  }

  function handleWeekChange(increment: number, resetForm: Function) {
    const newDate = new Date(state.date);
    newDate.setDate(state.date.getDate() + increment);
    dispatch({ type: 'change_date', date: newDate });
    resetForm({});
  }
}