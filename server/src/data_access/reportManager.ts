import { SqlManager, SqlParameter, sql } from "./sql_manager/sqlManager";
import { environment } from "../../environment/environment";
import { ResponseOut } from "../sdk/response";
import { Enums } from "../sdk/enums";
import { StatusConstants } from "../sdk/constatnts";
import { ProjectsHoursByYearDataInfo } from "../sdk/data_info/timeSheet/projectsHoursByYearDataInfo";
import { ProjectHoursDataInfo } from "../sdk/data_info/project/projectHoursDataInfo";
import { HoursByUserDataOut } from "../sdk/data_out/reports/hoursByUserDataOut";
import { UtilClass } from "../util_class";
const mssql = require('mssql');

export class ReportManager {
    async GetProjectsHoursByYear(year: number) {
        let sql = 'SELECT p.Name Name, t.ProjectId ProjectId, sum(t.Hours) MonthHours, DATEPART(mm, t.Date) CalendarMonth FROM TimeSheet t ' +
            'INNER JOIN Projects p ON t.ProjectId = p.Id ' +
            'WHERE p.State= @State and DATEPART(YYYY, t.Date) = @Year ' +
            'GROUP BY DATEPART(mm, t.Date), p.Name, t.ProjectId ' +
            'ORDER BY CalendarMonth, Name ';

        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Year', mssql.Int, year));
        params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.ACTIVE));

        var manager = new SqlManager(environment.db);
        let result = await manager.executeQuery(sql, params);

        let res = new Array<ProjectsHoursByYearDataInfo>();
        let currentMonth: number = null;
        let aux = new ProjectsHoursByYearDataInfo();
        result.forEach(function (element: any) {
            if (currentMonth != element.CalendarMonth) {
                currentMonth = element.CalendarMonth;
                aux = new ProjectsHoursByYearDataInfo();
                aux.month = currentMonth;
                res.push(aux);
            }
            let hoursProject = new ProjectHoursDataInfo();
            hoursProject.project.id = element.ProjectId;
            hoursProject.project.name = element.Name;
            hoursProject.hours = element.MonthHours;
            aux.projects.push(hoursProject)
        });

        return new ResponseOut(Enums.responseCode.Ok, '', res);
    }

    async GetHoursByUser(year: number, month: number) {
        let str = 'SELECT *, ' +
            '(SELECT sum ([Hours]) TotalHours FROM TimeSheet WHERE [UserId] = u.Id) as TotalHours, ' +
            '(SELECT sum ([Hours]) MonthHours FROM TimeSheet WHERE [UserId] = u.Id AND DATEPART(mm, [Date]) = @Month AND DATEPART(yyyy, [Date]) =  @Year) as MonthHours, ' +
            '(SELECT TOP 1 [Date] FROM TimeSheet WHERE [UserId] = u.Id ORDER BY [Date] DESC) as LastTime ' +
            'FROM Users u  WHERE State=@State order by Name';

        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Year', mssql.Int, year));
        params.push(new SqlParameter('Month', mssql.Int, month));
        params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.ACTIVE));

        var manager = new SqlManager(environment.db);
        let result = await manager.executeQuery(str, params);
        let res = new Array<HoursByUserDataOut>();
        for (const element of result) {
            let aux = new HoursByUserDataOut();
            aux.user.id = element.Id;
            aux.user.email = element.Email;
            aux.user.color = element.Color;
            aux.user.initials = element.Initials;
            aux.user.name = element.Name;
            aux.lastTime = ((UtilClass.IsNull(element.LastTime) ? new Date(-8640000000000000) : element.LastTime)); // new Date(-8640000000000000) = min date
            aux.monthHours = element.MonthHours;
            aux.totalHours = element.TotalHours;

            await this.GetProjectsHours(aux.user.id, year, month).then(function (projects) {
                aux.projects = projects;
            });

            res.push(aux);
        };

        return new ResponseOut(Enums.responseCode.Ok, '', res);
    }

    async GetProjectsHours(userId: string, year: number, month: number) {
        let str = 'SELECT sum([Hours]) as ProjectMonthHours, [ProjectId], p.Id as Id, p.Name as Name, p.Description as Description ' +
            'FROM TimeSheet INNER JOIN Projects p ON ProjectId = p.Id ' +
            'WHERE UserId = @UserId AND DATEPART(mm, [Date]) = @Month AND DATEPART(yyyy, [Date]) = @Year GROUP BY[ProjectId], p.Id, p.Name, p.Description ' +
            'ORDER BY p.Name';
        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Year', mssql.Int, year));
        params.push(new SqlParameter('Month', mssql.Int, month));
        params.push(new SqlParameter('UserId', mssql.VarChar(36), userId));

        let result = new Array<ProjectHoursDataInfo>();
        var manager = new SqlManager(environment.db);
        let res = await manager.executeQuery(str, params);
        res.forEach(function (element: any) {
            let aux = new ProjectHoursDataInfo();
            aux.hours = element.ProjectMonthHours;
            aux.project.id = element.Id;
            aux.project.description = element.Description;
            aux.project.name = element.Name;

            result.push(aux);
        });

        return result;
    }
}