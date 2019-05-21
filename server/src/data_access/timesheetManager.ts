import { SqlManager, SqlParameter } from "./sql_manager/sqlManager";
import { ProjectTimeSheetDataOut } from "../sdk/data_out/timesheet/projectTimeSheetDataOut";
import { ProjectDataInfo } from "../sdk/data_info/project/projectDataInfo";
import { UtilClass } from "../util_class";
import { ProjectManager } from "./projectManager";
import { environment } from "../../environment/environment";
import { ResponseOut } from "../sdk/response";
import { Enums } from "../sdk/enums";
import { StatusConstants } from "../sdk/constatnts";
import { ItemTimeSheetDataOut } from "../sdk/data_out/timesheet/itemTimeSheetDataOut";
import { AddTimesheetDataIn } from "../sdk/data_in/addTimeSheetDataIn";
import { ProjectsHoursByYearDataInfo } from "../sdk/data_info/timeSheet/projectsHoursByYearDataInfo";
import { ProjectHoursDataInfo } from "../sdk/data_info/project/projectHoursDataInfo";
const mssql = require('mssql');
const uuidv1 = require('uuid/v1');

export class TimesheetManager {
    async GetProjectTimesheetHours(month: number, year: number) {
        let str = 'SELECT *, (SELECT sum ([Hours]) TotalHours FROM TimeSheet WHERE [ProjectId] = p.Id) as TotalHours, ' +
            '(SELECT sum ([Hours]) MonthHours FROM TimeSheet WHERE [ProjectId] = p.Id AND DATEPART(mm, [Date]) = @Month AND ' +
            'DATEPART(yyyy, [Date]) = @Year) as MonthHours, (SELECT TOP 1 [Date] FROM TimeSheet WHERE [ProjectId] = p.Id ORDER BY ' +
            '[Date] DESC) as LastTime FROM Projects p WHERE State=@State order by MonthHours desc';

        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Year', mssql.Int, year));
        params.push(new SqlParameter('Month', mssql.Int, month));
        params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.ACTIVE));

        var manager = new SqlManager(environment.db);
        let res = await manager.executeQuery(str, params);

        let result = new Array<ProjectTimeSheetDataOut>();

        var projManager = new ProjectManager();
        for (const element of res) {
            let data = new ProjectTimeSheetDataOut();
            data.project = new ProjectDataInfo();

            data.project.id = element.Id;
            data.project.name = element.Name;
            data.project.description = ((UtilClass.IsNullOrWithSpaces(element.Description) ? '' : element.Description));

            data.lastTime = ((UtilClass.IsNull(element.LastTime) ? new Date(-8640000000000000) : element.LastTime)); // new Date(-8640000000000000) = min date
            data.monthHours = ((UtilClass.IsNull(element.MonthHours) ? 0 : element.MonthHours));
            data.totalHours = ((UtilClass.IsNull(element.TotalHours) ? 0 : element.TotalHours));

            await projManager.GetUserMonthHoursByProject(data.project.id, month, year).then(function (res) {
                data.usersHoursByProject = res;
            });

            result.push(data);
        }

        return new ResponseOut(Enums.responseCode.Ok, '', result);
    }

    async GetByUser(month: number, year: number) {
        let sql = 'SELECT ts.Id, ts.Date, ts.Hours, ts.Observations, p.Id AS ProjectId, p.Name AS ProjectName FROM TimeSheet ts ' +
            'INNER JOIN Projects p ON ts.ProjectId = p.Id ' +
            'WHERE YEAR(Date)=@Year AND MONTH(Date)=@Month AND UserId=@UserId ' +
            'union ' +
            'SELECT @emtpy, CONVERT (date, dt_val), @emtpy, @emtpy, @emtpy, @emtpy  from (  ' +
            'SELECT (dateadd(dd, value, dateadd(month, @Month - 1, dateadd(year, @Year - 1900, @minDate)))) as dt_val ' +
            'FROM( ' +
            'SELECT (v2 * 4 + v1) * 4 + v0 as value FROM ' +
            '(SELECT 0 as v0 union select 1 union select 2 union SELECT 3) as rs0 cross join ' +
            '(SELECT 0 as v1 union select 1 union SELECT 2 union SELECT 3) as rs1 cross join ' +
            '(SELECT 0 as v2 union select 1 union select 2 union SELECT 3) as rs2 ' +
            ') as rs ' +
            ') as rs2 ' +
            'WHERE month(dt_val) = @Month and not exists (SELECT ts.Date FROM TimeSheet ts ' +
            'INNER JOIN Projects p ON ts.ProjectId = p.Id ' +
            'WHERE DAY(dt_val) = DAY(Date) AND Month(dt_val) = Month(Date) AND YEAR(dt_val) = YEAR(ts.Date) AND UserId=@userid) ' +
            'order by ts.Date';

        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Year', mssql.Int, year));
        params.push(new SqlParameter('Month', mssql.Int, month));
        params.push(new SqlParameter('UserId', mssql.VarChar(36), UtilClass.user_id));
        params.push(new SqlParameter('minDate', mssql.VarChar(10), '1900.01.01'));
        params.push(new SqlParameter('emtpy', mssql.VarChar(1), ''));

        var manager = new SqlManager(environment.db);
        let result = await manager.executeQuery(sql, params);

        let res = new Array<ItemTimeSheetDataOut>();
        result.forEach(function (element: any) {
            let aux = new ItemTimeSheetDataOut();
            aux.id = element.Id;
            let date = new Date(element.Date);
            aux.date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            aux.isWeekend = UtilClass.DayIsWeekend(aux.date.getDay());
            aux.project.id = element.ProjectId;
            aux.project.name = element.ProjectName;
            aux.hours = element.Hours;
            aux.observations = ((UtilClass.IsNullOrWithSpaces(element.Observations) ? '' : element.Observations));

            res.push(aux);
        });

        return new ResponseOut(Enums.responseCode.Ok, '', res);

    }

    async Add(data: AddTimesheetDataIn) {
        let strBuilder: string[] = [];
        strBuilder.push('DELETE FROM TimeSheet WHERE YEAR([Date])=@Year AND MONTH([Date])=@Month AND UserId=@UserId;');

        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Year', mssql.Int, data.year));
        params.push(new SqlParameter('Month', mssql.Int, data.month));
        params.push(new SqlParameter('UserId', mssql.VarChar(36), UtilClass.user_id));

        let count = 0;
        data.items.forEach(function (element: any) {
            if (!UtilClass.IsNullOrWithSpaces(element.project.id)) {
                if (element.hours === 0) {
                    return new ResponseOut(Enums.responseCode.Error, 'All selected projects must have hours assigned.', {});
                }
                strBuilder.push(`INSERT INTO [TimeSheet] ([Id],[Date],[ProjectId],[Hours],[Observations],[UserId]) VALUES (@Id_${count}, @Date_${count}, @ProjectId_${count}, @Hours_${count}, @Observations_${count}, @UserId);`);
                params.push(new SqlParameter(`Id_${count}`, mssql.VarChar(36), uuidv1()));
                params.push(new SqlParameter(`Date_${count}`, mssql.Date, element.date));
                params.push(new SqlParameter(`ProjectId_${count}`, mssql.VarChar(36), element.project.id));
                params.push(new SqlParameter(`Hours_${count}`, mssql.Int, element.hours));
                params.push(new SqlParameter(`Observations_${count}`, mssql.VarChar(500), element.observations));
            }

            count = count + 1;
        });

        if (count === 0) {
            return new ResponseOut(Enums.responseCode.Error, 'No Timesheets to add. Please try again.', {});
        }

        var manager = new SqlManager(environment.db);
        let str = strBuilder.join("");
        await manager.executeNonQuery(str, params);
        return new ResponseOut(Enums.responseCode.Ok, 'Time added successfully.', {});
    }
}