import update from 'immutability-helper';
import { getMonthShortName } from '../../../utils/date';

export function generateInitialEntries(startDate, timesheet, projects) {
  const hours = {};
  for (let [key, entries] of Object.entries(timesheet)) {
    hours[key] = getCompleteWeek(startDate, entries);
  }
  return { hours };
}

export function getCompleteWeek(startDate, availableEntries) {
  const entries = {};
  let date = new Date(startDate);
  for (let day = 0; day < 7; day++) {
    // eslint-disable-next-line
    const entry = availableEntries.find(e => e.date && new Date(e.date).toDateString() === date.toDateString());
    entries[date.toISOString().slice(0, 10)] = (entry && entry.hours) || '';
    date = new Date(date);
    date.setDate(date.getDate() + 1);
  }
  return entries;
}

export function getTimeChanges(userId, original, entries = {}) {
  let changes = [];

  Object.keys(entries).forEach(projectId => {
    for (let [key, value] of Object.entries(entries[projectId])) {
      const exists = (original[projectId] || []).find(e => e.date.slice(0, 10) === key);

      if ((!exists && value) || (exists && exists.hours !== Number(value))) {
        const hours = Number(value) || null;
        const change = exists
          ? { ...exists, hours }
          : { projectId: Number(projectId), userId, date: key, hours, unsaved: true };

        changes.push(change);
      }
    }
  });

  return changes;
}

export function getMonthLabel(date) {
  return `MONTH: ${getMonthShortName(date)}`;
}

export function updateEntries(original, changes) {
  let newEntries = { ...original };

  changes.forEach(change => {
    const list = newEntries[change.projectId];
    if (!list) {
      newEntries[change.projectId] = [change];
    } else {
      const index = list.findIndex(x => x.date === change.date);
      if (index >= 0) {
        newEntries = update(newEntries, {
          [change.projectId]: { [index]: { $merge: { hours: change.hours } } }
        });
      } else {
        newEntries = update(newEntries, { [change.projectId]: { $push: [change] } });
      }
    }
  });

  return newEntries;
}
