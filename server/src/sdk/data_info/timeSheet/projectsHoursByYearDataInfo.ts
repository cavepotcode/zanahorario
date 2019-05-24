import { ProjectHoursDataInfo } from 'sdk/data_info/project/projectHoursDataInfo';

export class ProjectsHoursByYearDataInfo {
  constructor() {
    this.projects = [];
  }

  month: number;
  projects: ProjectHoursDataInfo[];
}
