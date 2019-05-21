import { ProjectDataInfo } from "../../data_info/project/projectDataInfo";
import { UserHoursByProject } from "../../data_info/project/usersHoursByProject";

export class ProjectTimeSheetDataOut {
    lastTime: Date;
    totalHours: number;
    tonthHours: number;
    monthHours: number;
    project: ProjectDataInfo;
    usersHoursByProject: Array<UserHoursByProject>;
}