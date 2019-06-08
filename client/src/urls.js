const prefix = '/v1';

export const apiUrls = {
  login: `${prefix}/security/login`,
  projects: (month, year) => {
    return `${prefix}/timesheet/getProjectTimesheetHours/${month}/${year}`;
  }
};
