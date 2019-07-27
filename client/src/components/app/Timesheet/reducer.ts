import { getMonthLabel } from './helper';
import { lastMonday } from '../../../utils/date';

type State = {
  addingProject: boolean;
  date: Date;
  entries: any[];
  monthLabel: string;
  ready: boolean;
  remainingProjects: any[];
  timesheet: any[];
};

const monday = lastMonday();
export const initialState: State = {
  addingProject: false,
  date: monday,
  entries: [],
  monthLabel: getMonthLabel(monday),
  timesheet: [],
  ready: false,
  remainingProjects: []
};

export function reducer(state: State, action: any) {
  switch (action.type) {
    case 'change_date':
      return { ...state, date: action.date, monthLabel: getMonthLabel(action.date) };
    case 'set_entries':
      return { ...state, entries: action.entries };
    case 'set_timesheet':
      const remainingProjects =
        action.projects &&
        action.projects.filter(
          (proj: any) =>
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
      return { ...state, addingProject: !state.addingProject };
    default:
      throw new Error();
  }
}
