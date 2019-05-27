import { ProjectDataInfo } from '../../data_info/project/projectDataInfo';

export class TimesheetDataInfo {
  constructor() {
    this.project = new ProjectDataInfo();
  }
  id: string;
  date: Date;
  project: ProjectDataInfo;
  hours: number;
  observations: string;
}
