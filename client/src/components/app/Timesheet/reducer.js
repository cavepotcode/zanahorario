import { getMonthLabel } from './helper';
import { lastMonday } from '../../../utils/date';

const monday = lastMonday();
export const initialState = {
  addingProject: false,
  date: monday,
  monthLabel: getMonthLabel(monday),
  timesheet: [],
  ready: false,
  remainingProjects: []
};

export function reducer(state, action) {
  switch (action.type) {
    case 'change_date':
      return { ...state, date: action.date, monthLabel: getMonthLabel(action.date) };
    case 'set_entries':
      return { ...state, entries: action.entries };
    case 'set_timesheet':
      const remainingProjects =
        action.projects &&
        action.projects.filter(
          proj =>
            !Object.keys(action.timesheet.hours)
              .map(Number)
              .includes(proj.id)
        );
      return {
        ...state,
        addingProject: false,
        ready: true,
        remainingProjects: remainingProjects || state.remainingProjects,
        timesheet: action.timesheet
      };
    case 'add_project':
      return { ...state, addingProject: true };
    default:
      throw new Error();
  }
}
