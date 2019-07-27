import update from 'immutability-helper';
import { getMonthShortName } from '../../../utils/date';
import { IFieldValue, ITimesheet, ITimesheetEntry } from './interfaces';

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

/**
 * Returns the hours to apply to the each field, so the entire week (8 hours daily) sums
 * up 40 hours, with the selected projects.
 */
export function fillWeek({ hours }: any): IFieldValue[] {
  const result: IFieldValue[] = [];
  const list: string[] = Object.keys(hours);

  list.forEach((projId: string) => {
    const projHours: ITimesheetEntry = hours[projId];
    Object.keys(projHours).forEach((date: string, index: number) => {
      // Only workdays
      if (index < 5) {
        const [emptyDays, dayTotal] = getDayEntries(hours, date);

        if (!hours[projId][date] && dayTotal < 8) {
          result.push({ field: `hours.${projId}.${date}`, value: (8 - dayTotal) / emptyDays });
        }
      }
    });
  });
  return result;
}

/**
 * Return all the entries for a given date and the total.
 */
function getDayEntries(hours: any, date: string): [number, number] {
  const projects: string[] = Object.keys(hours);
  let total = 0;
  let emptyDays = 0;
  projects.forEach((projId: string) => {
    const val = Number(hours[projId][date]);
    total += val;
    if (!val) {
      emptyDays += 1;
    }
  });
  return [emptyDays, total];
}
