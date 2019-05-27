import { ProjectDataInfo } from '../../data_info/project/projectDataInfo';

export class ItemTimeSheetDataOut {
  constructor() {
    this.project = new ProjectDataInfo();
  }
  id: string;
  date: Date;
  project: ProjectDataInfo;
  hours: number;
  isWeekend: boolean;
  observations: string;
  isAdded: boolean;
}
