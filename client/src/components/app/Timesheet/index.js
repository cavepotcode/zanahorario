import React, { useReducer } from 'react';
import update from 'immutability-helper';
import { Form } from 'informed';
import useStoreon from 'storeon/react';
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

const monday = lastMonday();
const initialState = {
  addingProject: false,
  date: monday,
  monthLabel: getMonthLabel(monday),
  pendingChanges: false,
  timesheet: [],
  remainingProjects: []
};

export default function Timesheet() {
  const { addNotification } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { dispatch: fetchProjects, projects } = useStoreon('projects');

  React.useEffect(() => {
    fetchProjects('projects/fetch');
  }, [fetchProjects]);

  React.useEffect(() => {
    async function fetch() {
      try {
        const { data: timesheet } = await api.get(apiUrls.timesheets.user(state.date));
        const entries = generateInitialEntries(state.date, timesheet, projects.items);
        dispatch({ type: 'set_timesheet', timesheet: entries, projects: projects.items });
      } catch (err) {
        addNotification(err.message);
      }
    }

    if (projects.items.length) {
      fetch();
    }
  }, [state.date, projects.items, addNotification]);

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
          {state.addingProject && (
            <NewProject
              projects={state.remainingProjects}
              selectedIds={state.timesheet.map(t => t.project.id)}
              onSelect={handleNewProject}
            />
          )}
          <footer>
            {state.remainingProjects.length > 0 && (
              <Button onClick={handleAddProject} type="button">
                Add Project
              </Button>
            )}
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
    dispatch({ type: 'set_timesheet', timesheet, projects: projects.items });
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

function reducer(state, action) {
  switch (action.type) {
    case 'change_date':
      return { ...state, date: action.date, monthLabel: getMonthLabel(action.date) };
    case 'set_timesheet':
      const remainingProjects =
        action.projects && action.projects.filter(proj => !action.timesheet.map(e => e.project.id).includes(proj.id));
      return {
        ...state,
        remainingProjects: remainingProjects || state.remainingProjects,
        addingProject: false,
        timesheet: action.timesheet
      };
    case 'add_project':
      return { ...state, addingProject: true };
    case 'pending_changes':
      return { ...state, pendingChanges: action.value };
    default:
      throw new Error();
  }
}
