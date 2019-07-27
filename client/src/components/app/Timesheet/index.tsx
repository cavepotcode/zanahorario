import React, { useReducer } from 'react';
import { Form, Formik, FormikActions, FormikProps } from 'formik';
import useStoreon from 'storeon/react';
import mousetrap from 'mousetrap';
import CalendarHeader from './CalendarHeader';
import ProjectLine from './ProjectLine';
import NewProject from './NewProject';
import { reducer, initialState } from './reducer';
import styles from './styles.module.scss';
import { fillWeek, getCompleteWeek, generateInitialEntries, getTimeChanges, updateEntries } from './helper';
import ValueSlider from '../../ui/ValueSlider';
import Button from '../../ui/Button';
import HotkeyHelp from '../../ui/HotkeyHelp';
import api from '../../../utils/api';
import { lastMonday } from '../../../utils/date';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';
import { IFieldValue, IProject, ITimesheet } from './interfaces';
import hotkeys from '../../../hotkeys';

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
        let { data: entries } = await api.get(apiUrls.timesheets.user(state.date));
        dispatch({ type: 'set_entries', entries });

        // If week is empty, show the most recent projects
        if (Object.keys(entries).length === 0) {
          user.recentProjects.forEach((proj: number) => (entries[proj] = []));
        }

        const timesheet = generateInitialEntries(state.date, entries, projects.items);
        dispatch({ type: 'set_timesheet', timesheet, projects: projects.items });
      } catch (err) {
        addNotification(err.message);
      }
    }

    if (projects.items.length) {
      fetch();
    }
  }, [state.date, projects.items, user, addNotification]);

  const formElem = React.useRef(null);

  const handleAddProject = React.useCallback(() => {
    if (state.remainingProjects.length > 0) {
      dispatch({ type: 'add_project' });
    }
  }, [state.remainingProjects.length]);

  const fillTimesheet = React.useCallback(() => {
    const form = formElem.current as any;
    const changes = fillWeek(form.state.values);
    changes.forEach(({ field, value }: IFieldValue) => {
      form.setFieldValue(field, value);
    });
  }, []);

  const handleSubmit = React.useCallback(async (values: ITimesheet, actions: FormikActions<ITimesheet>) => {
    const { isValid, dirty } = (formElem.current as any).getFormikComputedProps();
    if (!isValid || (isValid && !dirty)) {
      return;
    }

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
  }, [addNotification, state.entries, user.userId]);

  const submit = React.useCallback(async () => {
    const form = formElem.current as any;
    const values = form.state.values;
    const actions = form.getFormikActions();
    return await handleSubmit(values, actions);
  }, [handleSubmit]);

  React.useEffect(() => {
    mousetrap.bind(hotkeys.timesheet.add, handleAddProject);
    mousetrap.bind(hotkeys.timesheet.fill, fillTimesheet);
    mousetrap.bind(hotkeys.timesheet.save, submit);

    return () => {
      mousetrap.unbind(hotkeys.timesheet.add);
      mousetrap.unbind(hotkeys.timesheet.fill);
      mousetrap.unbind(hotkeys.timesheet.save);
    };
  }, [handleAddProject, fillTimesheet, submit]);

  if (!state.ready) {
    return null;
  }
  const weekHotkeys = {
    hotkeyPrev: hotkeys.timesheet.prevWeek,
    hotkeyNext: hotkeys.timesheet.nextWeek,
    hotkeyReset: hotkeys.timesheet.today
  };
  const monthHotkeys = {
    hotkeyPrev: hotkeys.timesheet.prevMonth,
    hotkeyNext: hotkeys.timesheet.nextMonth,
    hotkeyReset: hotkeys.timesheet.today
  };

  return (
    <Formik
      enableReinitialize
      initialValues={state.timesheet}
      onSubmit={handleSubmit}
      ref={formElem}
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
              {...monthHotkeys}
            />
            <ValueSlider
              disabled={props.dirty}
              onPrev={() => handleWeekChange(-7, props.resetForm)}
              onNext={() => handleWeekChange(7, props.resetForm)}
              onReset={() => resetDate(props.resetForm)}
              value="WEEK"
              {...weekHotkeys}
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
                <HotkeyHelp keys={hotkeys.timesheet.add} />
              </Button>
            )}
            <Button type="submit" disabled={!props.isValid || (props.isValid && !props.dirty)}>
              Save
              <HotkeyHelp keys={hotkeys.timesheet.save} />
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

  function resetDate(resetForm: Function) {
    const newDate = new Date(initialState.date);
    dispatch({ type: 'change_date', date: newDate });
    resetForm({});
  }
}
