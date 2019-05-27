import { ProjectDataInfo } from './projectDataInfo';

export class ProjectHoursDataInfo {
  constructor() {
    this.project = new ProjectDataInfo();
  }
  project: ProjectDataInfo;
  hours: number;
}
