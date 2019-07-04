const prefix = '/v1';

export const apiUrls = {
  login: `${prefix}/security/login`,
  projectsTime: (month, year) => {
    return `${prefix}/timesheet/project?month=${month}&year=${year}`;
  },
  projects: {
    index: `${prefix}/project`
  }
};
