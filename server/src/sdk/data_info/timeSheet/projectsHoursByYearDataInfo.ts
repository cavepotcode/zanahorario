import { ProjectHoursDataInfo } from "sdk/data_info/project/projectHoursDataInfo";

export class ProjectsHoursByYearDataInfo {
    constructor(){
        this.projects = new Array<ProjectHoursDataInfo>();
    }
    month: number;
    projects: Array<ProjectHoursDataInfo>
}