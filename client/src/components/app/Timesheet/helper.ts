import update from 'immutability-helper';
import { getMonthShortName } from '../../../utils/date';
import { ITimesheet, ITimesheetEntry } from './interfaces';

export function generateInitialEntries(startDate: Date, timesheet: ITimesheet, projects: any[]) {
  const hours: any = {};
  for (const [key, entries] of Object.entries(timesheet)) {
    hours[key] = getCompleteWeek(startDate, entries);
  }
  return { hours };
}

export function getCompleteWeek(startDate: Date, availableEntries: ITimesheetEntry[]) {
  const entries: any = {};
  let date = new Date(startDate);
  for (let day = 0; day < 7; day += 1) {
    // eslint-disable-next-line
    const entry = availableEntries.find(e => e.date && new Date(e.date).toDateString() === date.toDateString());
    entries[date.toISOString().slice(0, 10)] = (entry && entry.hours) || '';
    date = new Date(date);
    date.setDate(date.getDate() + 1);
  }
  return entries;
}

export function getTimeChanges(userId: number, original: any, entries: any = {}) {
  const changes: any[] = [];

  Object.keys(entries).forEach((projectId: string) => {
    for (const [key, value] of Object.entries(entries[projectId])) {
      const exists = (original[projectId] || []).find((e: any) => e.date.slice(0, 10) === key);

      if ((!exists && value) || (exists && exists.hours !== Number(value))) {
        const hours = Number(value) || null;
        const change = exists
          ? { ...exists, hours }
          : { hours, userId, projectId: Number(projectId), date: key, unsaved: true };

        changes.push(change);
      }
    }
  });

  return changes;
}

export function getMonthLabel(date: Date) {
  return `MONTH: ${getMonthShortName(date)}`;
}

export function updateEntries(original: any, changes: any[]) {
  let newEntries = { ...original };

  changes.forEach((change: any) => {
    const list = newEntries[change.projectId];
    if (!list) {
      newEntries[change.projectId] = [change];
    } else {
      const index = list.findIndex((x: any) => x.date === change.date);
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
