import React from 'react';
import update from 'immutability-helper';
import { Form } from 'informed';
import CalendarHeader from './CalendarHeader';
import ProjectLine from './ProjectLine';
import styles from './styles.module.scss';
import { generateInitialEntries, getTimeChanges } from './helper';
import ValueSlider from '../../ui/ValueSlider';
import { getMonthShortName } from '../../../utils/date';
import { lastMonday } from '../../../utils/date';
import Button from '../../ui/Button';
import api from '../../../utils/api';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';

export default function Timesheet() {
  const { addNotification } = useSnackbar();
  const [date, setDate] = React.useState(lastMonday());
  const [monthLabel, setMonthLabel] = React.useState(getMonthLabel(date));
  const [projectsTime, setProjectsTime] = React.useState([]);
  const [enableSubmit, setEnableSubmit] = React.useState(false);

  React.useEffect(() => {
    async function fetch() {
      try {
        const [projectsResp, timesheetsResp] = await Promise.all([
          api.get(apiUrls.projects.index),
          api.get(apiUrls.timesheets.user(date))
        ]);

        const { data: projects } = projectsResp;
        const { data: timesheet } = timesheetsResp;

        const projectsTime = [];
        for (let [key, entries] of Object.entries(timesheet)) {
          projectsTime.push({
            project: projects.find(p => p.id === Number(key)),
            entries: entries.map(e => ({ ...e, date: new Date(e.date) }))
          });
        }

        const entries = generateInitialEntries(date, projectsTime);
        setProjectsTime(entries);
      } catch (err) {
        addNotification(err.message);
      }
    }

    fetch();
  }, [date, addNotification]);

  return (
    <Form className={styles.container}>
      {({ formState }) => (
        <>
          <header>
            <ValueSlider onPrev={() => handleMonthChange(-1)} onNext={() => handleMonthChange(1)} value={monthLabel} />
            <ValueSlider onPrev={() => handleWeekChange(-7)} onNext={() => handleWeekChange(7)} value="WEEK" />
          </header>
          <CalendarHeader startDate={date} />
          {projectsTime.map(({ project, entries }) => (
            <ProjectLine
              entries={entries}
              key={project.name}
              onEntered={handleEntered}
              project={project}
              startDate={date}
            />
          ))}
          <footer>
            <Button onClick={handleAddProject} type="button">
              Add Project
            </Button>
            <Button onClick={() => handleSave(formState.invalid)} type="submit" disabled={!enableSubmit}>
              Save
            </Button>
          </footer>
        </>
      )}
    </Form>
  );

  async function handleSave(invalid) {
    if (invalid) {
      return addNotification('Please fix the errors before submitting.');
    }

    const changes = getTimeChanges(projectsTime);
    if (changes.length) {
      const { meta } = await api.post(apiUrls.timesheets.index, changes);

      const message = !meta.code ? 'Changes saved correctly' : meta.message;
      addNotification(message);
      setEnableSubmit(false);
    }
  }

  function handleEntered(projectId, entry) {
    const projectIndex = projectsTime.findIndex(({ project }) => project.id === projectId);
    const project = projectsTime[projectIndex];
    const entryIndex = project.entries.findIndex(({ date }) => date === entry.date);
    const oldEntry = project.entries[entryIndex];

    if (entryIndex >= 0 && Number(entry.hours) !== Number(oldEntry.hours)) {
      const newTimesheets = update(projectsTime, {
        [projectIndex]: { entries: { [entryIndex]: { $merge: { hours: entry.hours, changed: true } } } }
      });
      setProjectsTime(newTimesheets);
      setEnableSubmit(true);
    }
  }

  function handleAddProject() {
    // setProjectsTime([...projects, { name: 'Random', id: 2 }]);
  }

  function handleMonthChange(increment) {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + increment);
    setDate(newDate);
    setMonthLabel(getMonthLabel(newDate));
  }

  function handleWeekChange(increment) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + increment);
    setDate(newDate);
    setMonthLabel(getMonthLabel(newDate));
  }

  function getMonthLabel(date) {
    return `MONTH: ${getMonthShortName(date)}`;
  }
}
