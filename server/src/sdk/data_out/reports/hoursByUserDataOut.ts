import { UserDataInfo } from "../../data_info/user/userDataInfo";
import { ProjectHoursDataInfo } from "../../data_info/project/projectHoursDataInfo";

export class HoursByUserDataOut {
    constructor() {
        this.user = new UserDataInfo();
        this.projects = new Array<ProjectHoursDataInfo>();
    }
    lastTime: Date;
    totalHours: number;
    monthHours: number;
    user: UserDataInfo
    projects: Array<ProjectHoursDataInfo>;
}