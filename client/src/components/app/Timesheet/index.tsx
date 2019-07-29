import React from 'react';
import { Form, Formik, FormikActions, FormikProps } from 'formik';
import useStoreon from 'storeon/react';
import CalendarHeader from './CalendarHeader';
import ProjectLine from './ProjectLine';
import NewProject from './NewProject';
import styles from './styles.module.scss';
import { fillWeek, getCompleteWeek, getMonthLabel, getTimeChanges, updateEntries } from './helper';
import ValueSlider from '../../ui/ValueSlider';
import Button from '../../ui/Button';
import HotkeyHelp from '../../ui/HotkeyHelp';
import api from '../../../utils/api';
import { lastMonday } from '../../../utils/date';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';
import { IFieldValue, IProject, ITimesheet } from './interfaces';
import hotkeys from '../../../hotkeys';
import useTimesheets from './useTimesheets';
import useRemainingProjects from './useRemainingProjects';
import useHotkey from './useHotkey';

export default function Timesheet() {
  const initialDate = lastMonday();
  const formElem = React.useRef(null);
  const { addNotification } = useSnackbar();
  const { dispatch, projects, user } = useStoreon('projects', 'user');
  const [addingProject, setAddingProject] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(initialDate);
  const [monthLabel, setMonthLabel] = React.useState(getMonthLabel(selectedDate));
  const { entries, timesheet, ready, setTimesheet, setEntries } = useTimesheets(user, selectedDate);
  const { remainingProjects } = useRemainingProjects(timesheet.hours, projects.items);

  React.useEffect(() => {
    dispatch('projects/fetch');
  }, [dispatch]);

  React.useEffect(() => {
    setMonthLabel(getMonthLabel(selectedDate));
  }, [selectedDate]);

  useHotkey(hotkeys.timesheet.add, handleAddProject);
  useHotkey(hotkeys.timesheet.fill, fillTimesheet);
  useHotkey(hotkeys.timesheet.save, submit);

  if (!ready) {
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

  if (!projects || !projects.items) {
    return null;
  }

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
            <ValueSlider
              disabled={props.dirty}
              onPrev={() => handleMonthChange(-1, props.resetForm)}
              onNext={() => handleMonthChange(1, props.resetForm)}
              value={monthLabel}
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

  function handleMonthChange(increment: number, resetForm: Function) {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + increment);
    setSelectedDate(lastMonday(newDate));
    resetForm({});
  }

  function handleWeekChange(increment: number, resetForm: Function) {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + increment);
    setSelectedDate(newDate);
    resetForm({});
  }

  function resetDate(resetForm: Function) {
    const newDate = new Date(initialDate);
    setSelectedDate(newDate);
    resetForm({});
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
