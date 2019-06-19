import { SqlParameter, SqlManager, sql } from './sql_manager/sqlManager';
import { environment } from '../../environment/environment';
import { ProjectTimeSheetDataOut } from '../sdk/data_out/timesheet/projectTimeSheetDataOut';
import { UserHoursByProject } from '../sdk/data_info/project/usersHoursByProject';
import { UserDataInfo } from '../sdk/data_info/user/userDataInfo';
import { ProjectDataInfo } from '../sdk/data_info/project/projectDataInfo';
import { Response } from '../sdk/response';
import { ResponseCode, StatusConstants } from '../sdk/constants';
const mssql = require('mssql');
const uuidv1 = require('uuid/v1');

export class ProjectManager {
  async getUserMonthHoursByProject(id: string, month: number, year: number) {
    const str =
      'SELECT sum([Hours]) as UserMonthHours, [UserId], u.Email as Email, u.Color as Color, u.Initials ' +
      'FROM TimeSheet INNER JOIN Users u ON UserId = u.Id ' +
      'WHERE ProjectId = @ProjectId AND DATEPART(mm, [Date]) = @Month AND DATEPART(yyyy, [Date]) = @Year ' +
      'GROUP BY[UserId], u.Email, u.Color, u.Initials ' +
      'ORDER BY u.Initials';

    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Year', mssql.Int, year));
    params.push(new SqlParameter('Month', mssql.Int, month));
    params.push(new SqlParameter('ProjectId', mssql.VarChar(36), id));

    const manager = new SqlManager(environment.db);
    const res = await manager.executeQuery(str, params);

    const result = <UserHoursByProject[]>[];
    res.forEach((element: any) => {
      const aux = new UserHoursByProject();
      aux.hours = element.UserMonthHours;
      aux.user = new UserDataInfo();
      aux.user.email = element.Email;
      aux.user.color = element.Color;
      aux.user.initials = element.Initials;
      result.push(aux);
    });

    return result;
  }

  async create(project: ProjectDataInfo) {
    const sql = 'INSERT INTO Projects (Id,Name,Description,State) VALUES (@Id,@Name,@Description,@State)';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(36), uuidv1()));
    params.push(new SqlParameter('Name', mssql.VarChar(50), project.name));
    params.push(new SqlParameter('Description', mssql.VarChar(500), project.description));
    params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.ACTIVE));

    const manager = new SqlManager(environment.db);
    await manager.executeNonQuery(sql, params);
    return new Response(ResponseCode.OK, 'Project added successfully', {});
  }

  async update(project: ProjectDataInfo) {
    const sql = 'UPDATE Projects SET Description=@Description WHERE Id=@Id; select @@rowcount as Count; ';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(36), project.id));
    params.push(new SqlParameter('Description', mssql.VarChar(500), project.description));

    const manager = new SqlManager(environment.db);
    const result = await manager.executeQuery(sql, params);
    if (!result[0].Count || result[0].Count === 0) {
      return new Response(ResponseCode.ERROR, 'There was a problem updating the project', {});
    }
    return new Response(ResponseCode.OK, 'Project updated successfully', {});
  }

  async delete(id: string) {
    const sql = 'UPDATE Projects SET State=@State WHERE Id=@Id; select @@rowcount as Count;';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(36), id));
    params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.DELETED));

    const manager = new SqlManager(environment.db);
    const result = await manager.executeQuery(sql, params);
    if (!result[0].Count || result[0].Count === 0) {
      return new Response(ResponseCode.ERROR, 'There was a problem deleting the project', {});
    }
    return new Response(ResponseCode.OK, 'Project deleted successfully', {});
  }

  async getAll() {
    const sql = 'SELECT * FROM Projects WHERE State=@State ORDER BY Name';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.ACTIVE));

    const manager = new SqlManager(environment.db);
    const result = await manager.executeQuery(sql, params);

    const ret = <ProjectDataInfo[]>[];
    result.forEach((element: any) => {
      const aux = new ProjectDataInfo();
      aux.id = element.Id;
      aux.description = element.Description;
      aux.name = element.Name;
      ret.push(aux);
    });

    return new Response(ResponseCode.OK, '', ret);
  }
}
