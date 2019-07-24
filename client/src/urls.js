import { parseDate } from './utils/date';

const prefix = '/v1';

export const apiUrls = {
  login: `${prefix}/security/login`,
  timesheets: {
    index: `${prefix}/timesheet/`,
    project: date => {
      const { year, month } = parseDate(date);
      return `${prefix}/timesheet/project?year=${year}&month=${month}`;
    },
    user: date => {
      const { year, month, day } = parseDate(date);
      return `${prefix}/timesheet/user?year=${year}&month=${month}&day=${day}`;
    }
  },
  projects: {
    index: `${prefix}/project`
  },
  users: {
    index: `${prefix}/user`,
    user: date => {
      const { year, month } = parseDate(date);
      return `${prefix}/user/users?year=${year}&month=${month}`;
    }
  }
};
