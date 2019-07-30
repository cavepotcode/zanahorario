import React, { useEffect } from 'react';
import { Form, Formik, FormikActions, FormikProps } from 'formik';
import useStoreon from 'storeon/react';
import CalendarHeader from './CalendarHeader';
import ProjectLine from './ProjectLine';
import NewProject from './NewProject';
import styles from './styles.module.scss';
import { fillWeek, getCompleteWeek, getMonthLabel, getTimeChanges, updateEntries } from './helper';
import ValueSlider, { useValueSlider } from '../../ui/ValueSlider';
import Button from '../../ui/Button';
import HotkeyHelp from '../../ui/HotkeyHelp';
import api from '../../../utils/api';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';
import { IFieldValue, IProject, ITimesheet } from './interfaces';
import hotkeys from '../../../hotkeys';
import useTimesheets from './useTimesheets';
import useRemainingProjects from './useRemainingProjects';
import useHotkey from '../../../hooks/useHotkey';
import { lastMonday } from '../../../utils/date';

export default function Timesheet() {
  const formElem = React.useRef(null);
  const { addNotification } = useSnackbar();
  const { dispatch, projects, user } = useStoreon('projects', 'user');
  const [addingProject, setAddingProject] = React.useState(false);
  const { selectedDate, prevMonthMonday, nextMonthMonday, prevWeek, nextWeek, resetDate } = useValueSlider(
    lastMonday(),
    () => (formElem.current as any).getFormikBag().dirty
  );
  const { entries, timesheet, ready, setTimesheet, setEntries } = useTimesheets(user, selectedDate);
  const { remainingProjects } = useRemainingProjects(timesheet.hours, projects.items);

  useHotkey(hotkeys.timesheet.add, handleAddProject);
  useHotkey(hotkeys.timesheet.fill, fillTimesheet);
  useHotkey(hotkeys.timesheet.save, submit);
  useEffect(() => dispatch('projects/fetch'), [dispatch]);

  if (!ready || !projects || !projects.loaded) {
    return null;
  }

  const weekHotkeys = {
    prev: { key: hotkeys.timesheet.prevWeek, handler: prevWeek },
    next: { key: hotkeys.timesheet.nextWeek, handler: nextWeek },
    reset: { key: hotkeys.timesheet.today, handler: resetDate }
  };
  const monthHotkeys = {
    prev: { key: hotkeys.timesheet.prevMonth, handler: prevMonthMonday },
    next: { key: hotkeys.timesheet.nextMonth, handler: nextMonthMonday },
    reset: { key: '', handler: () => null }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={timesheet}
      onSubmit={handleSubmit}
      ref={formElem}
      validateOnBlur
      validateOnChange={false}
      render={(props: FormikProps<ITimesheet>) => (
        <Form className={styles.container}>
          <header>
            <ValueSlider disabled={props.dirty} value={getMonthLabel(selectedDate)} hotkeys={monthHotkeys} />
            <ValueSlider disabled={props.dirty} value="WEEK" hotkeys={weekHotkeys} />
          </header>
          <CalendarHeader startDate={selectedDate} />
          {Object.keys(timesheet.hours).map(projectId => (
            <ProjectLine
              errors={props.errors.hours ? props.errors.hours[Number(projectId)] || {} : {}}
              key={projectId}
              project={projects.items.find((p: IProject) => p.id === Number(projectId))}
              startDate={selectedDate}
            />
          ))}
          {addingProject && (
            <NewProject
              projects={remainingProjects}
              onSelect={(project: IProject) => handleNewProject(project, props)}
            />
          )}
          <footer>
            {remainingProjects.length > 0 && (
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
        [project.id]: getCompleteWeek(selectedDate, [])
      }
    };
    if (props.dirty) {
      props.setValues(timesheet);
    } else {
      props.resetForm(timesheet);
    }
    setTimesheet(timesheet);
    setAddingProject(false);
  }

  async function submit() {
    const form = formElem.current as any;
    const values = form.state.values;
    const actions = form.getFormikActions();
    return await handleSubmit(values, actions);
  }

  async function handleSubmit(values: ITimesheet, actions: FormikActions<ITimesheet>) {
    const { isValid, dirty } = (formElem.current as any).getFormikComputedProps();
    if (!isValid || (isValid && !dirty)) {
      return;
    }

    const changes = getTimeChanges(user.userId, entries, values.hours);
    if (changes.length) {
      const { meta } = await api.post(apiUrls.timesheets.index, { entries: changes });

      const message = meta.code ? meta.message : 'Changes saved correctly';
      addNotification(message);

      if (!meta.code) {
        actions.resetForm(values);
        const newEntries = updateEntries(entries, changes);
        setEntries(newEntries);
      }
    } else {
      actions.resetForm(values);
    }
  }

  async function fillTimesheet() {
    const form = formElem.current as any;
    if (Object.keys(form.state.values.hours).length > 2) {
      addNotification('No es posible completar las horas para más de dos proyectos');
      return;
    }

    const changes: IFieldValue[] = fillWeek(form.state.values);
    changes.forEach(({ field, value }: IFieldValue) => {
      form.setFieldValue(field, value);
    });
  }

  async function handleAddProject() {
    if (remainingProjects.length > 0) {
      setAddingProject(!addingProject);
    }
  }
}
