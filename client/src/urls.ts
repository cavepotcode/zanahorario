import { parseDate } from './utils/date';

const prefix = '/v1';

export const apiUrls = {
  login: `${prefix}/security/login`,
  timesheets: {
    index: `${prefix}/timesheet/`,
    project: (date: Date) => {
      const { year, month } = parseDate(date);
      return `${prefix}/timesheet/project?year=${year}&month=${month}`;
    },
    user: (date: Date) => {
      const { year, month, day } = parseDate(date);
      return `${prefix}/timesheet/user?year=${year}&month=${month}&day=${day}`;
    }
  },
  projects: {
    index: `${prefix}/project`
  },
  users: {
    index: `${prefix}/user`,
    timesheets: (date: Date) => {
      const { year, month } = parseDate(date);
      return `${prefix}/user/?year=${year}&month=${month}`;
    }
  }
};
