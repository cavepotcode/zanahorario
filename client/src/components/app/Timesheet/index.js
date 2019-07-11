import React, { useReducer } from 'react';
import update from 'immutability-helper';
import { Form } from 'informed';
import CalendarHeader from './CalendarHeader';
import ProjectLine from './ProjectLine';
import NewProject from './NewProject';
import styles from './styles.module.scss';
import { getCompleteWeek, generateInitialEntries, getTimeChanges, getMonthLabel } from './helper';
import ValueSlider from '../../ui/ValueSlider';
import { lastMonday } from '../../../utils/date';
import Button from '../../ui/Button';
import api from '../../../utils/api';
import { apiUrls } from '../../../urls';
import useSnackbar from '../../Snackbar/useSnackbar';

const date = lastMonday();
const initialState = {
  addingProject: false,
  date,
  monthLabel: getMonthLabel(date),
  pendingChanges: false,
  projects: [],
  timesheet: []
};

export default function Timesheet() {
  const { addNotification } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    async function fetch() {
      const { data: projects } = await api.get(apiUrls.projects.index);
      dispatch({ type: 'set_projects', projects });
    }

    fetch();
  }, []);

  React.useEffect(() => {
    async function fetch() {
      try {
        const { data: timesheet } = await api.get(apiUrls.timesheets.user(state.date));

        const projectsTime = [];
        for (let [key, entries] of Object.entries(timesheet)) {
          projectsTime.push({
            project: state.projects.find(p => p.id === Number(key)),
            entries: entries.map(e => ({ ...e, date: new Date(e.date) }))
          });
        }

        const entries = generateInitialEntries(state.date, projectsTime);
        dispatch({ type: 'set_timesheet', timesheet: entries });
      } catch (err) {
        addNotification(err.message);
      }
    }

    if (state.projects.length) {
      fetch();
    }
  }, [state.date, state.projects, addNotification]);

  return (
    <Form className={styles.container}>
      {({ formState }) => (
        <>
          <header>
            <ValueSlider
              disabled={state.pendingChanges}
              onPrev={() => handleMonthChange(-1)}
              onNext={() => handleMonthChange(1)}
              value={state.monthLabel}
            />
            <ValueSlider
              disabled={state.pendingChanges}
              onPrev={() => handleWeekChange(-7)}
              onNext={() => handleWeekChange(7)}
              value="WEEK"
            />
          </header>
          <CalendarHeader startDate={state.date} />
          {state.timesheet.map(({ project, entries }) => (
            <ProjectLine
              entries={entries}
              key={project.name}
              onEntered={handleEntered}
              project={project}
              startDate={state.date}
            />
          ))}
          {state.addingProject && <NewProject projects={state.projects} onSelect={handleNewProject} />}
          <footer>
            <Button onClick={handleAddProject} type="button">
              Add Project
            </Button>
            <Button onClick={() => handleSave(formState.invalid)} type="submit" disabled={!state.pendingChanges}>
              Save
            </Button>
          </footer>
        </>
      )}
    </Form>
  );

  function handleNewProject(project) {
    const timesheet = [
      ...state.timesheet,
      {
        project,
        entries: getCompleteWeek(state.date, [])
      }
    ];
    dispatch({ type: 'set_timesheet', timesheet });
  }

  async function handleSave(invalid) {
    if (invalid) {
      return addNotification('Please fix the errors before submitting.');
    }

    const changes = getTimeChanges(state.timesheet);
    if (changes.length) {
      const { meta } = await api.post(apiUrls.timesheets.index, changes);

      const message = meta.code ? meta.message : 'Changes saved correctly';
      addNotification(message);

      if (!meta.code) {
        dispatch({ type: 'pending_changes', value: false });
      }
    }
  }

  function handleEntered(projectId, entry) {
    const projectIndex = state.timesheet.findIndex(({ project }) => project.id === projectId);
    const project = state.timesheet[projectIndex];
    const entryIndex = project.entries.findIndex(({ date }) => date === entry.date);
    const oldEntry = project.entries[entryIndex];

    if (entryIndex >= 0 && Number(entry.hours) !== Number(oldEntry.hours)) {
      const newTimesheets = update(state.timesheet, {
        [projectIndex]: { entries: { [entryIndex]: { $merge: { hours: entry.hours, changed: true } } } }
      });
      dispatch({ type: 'set_timesheet', timesheet: newTimesheets });
      dispatch({ type: 'pending_changes', value: true });
    }
  }

  function handleAddProject() {
    dispatch({ type: 'add_project', value: true });
  }

  function handleMonthChange(increment) {
    const newDate = new Date(state.date);
    newDate.setMonth(date.getMonth() + increment);
    dispatch({ type: 'change_date', date: newDate });
  }

  function handleWeekChange(increment) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + increment);
    dispatch({ type: 'change_date', date: newDate });
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'change_date':
      return { ...state, date: action.date, monthLabel: getMonthLabel(action.date) };
    case 'set_timesheet':
      return { ...state, addingProject: false, timesheet: action.timesheet };
    case 'add_project':
      return { ...state, addingProject: action.value };
    case 'pending_changes':
      return { ...state, pendingChanges: action.value };
    case 'set_projects':
      return { ...state, projects: action.projects };
    default:
      throw new Error();
  }
}
