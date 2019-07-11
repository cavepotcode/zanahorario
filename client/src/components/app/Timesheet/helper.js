import { getMonthShortName } from '../../../utils/date';

export function generateInitialEntries(startDate, projectsTime) {
  return projectsTime.map(({ project, entries }) => {
    return {
      project,
      entries: getCompleteWeek(startDate, entries)
    };
  });
}

export function getCompleteWeek(startDate, availableEntries) {
  const entries = [];
  let date = new Date(startDate);
  for (let day = 0; day < 7; day++) {
    // eslint-disable-next-line
    const entry = availableEntries.find(e => e.date && e.date.toDateString() === date.toDateString());
    entries.push({
      date,
      hours: (entry && entry.hours) || null
    });

    date = new Date(date);
    date.setDate(date.getDate() + 1);
  }
  return entries;
}

export function getTimeChanges(projectsTime) {
  let changes = [];
  projectsTime.forEach(({ project, entries }) => {
    const changedEntries = entries
      .filter(e => e.changed)
      .map(e => ({ date: e.date, hours: e.hours, projectId: project.id }));

    changes = [...changes, ...changedEntries];
  });

  return changes;
}

export function getMonthLabel(date) {
  return `MONTH: ${getMonthShortName(date)}`;
}
