import { Authorize, Body, Get, JsonController, Param, Post, QueryParam } from 'kiwi-server';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { TimesheetManager } from '../data_access/timesheetManager';
import { AddTimesheetDataIn } from '../sdk/data_in/addTimeSheetDataIn';
import { TimesheetService } from '../services/timesheet.service';
import { IDateFilter } from '../dto/date-filter.interface';

@Authorize()
@JsonController('/timesheet')
export class TimesheetController {
  constructor(private timeSvc: TimesheetService, private manager: TimesheetManager) {}

  // TODO: move to project controller?
  @Get('/project')
  public async getProjectsTimesheets(@QueryParam() params: IDateFilter) {
    try {
      const { year, month } = params;
      const result = await this.timeSvc.projectHours(year, month);
      return new Response(ResponseCode.OK, '', result);
    } catch (err) {
      Log.logError('TimesheetController.getProjectsTimesheets', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Get('/getByUser/:month/:year')
  public getByUser(@Param('month') month: number, @Param('year') year: number) {
    try {
      return this.manager.getByUser(month, year);
    } catch (err) {
      Log.logError('timesheet/getByUser', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Post('/add')
  public add(@Body() body: AddTimesheetDataIn) {
    try {
      return this.manager.add(body);
    } catch (err) {
      Log.logError('timesheet/add', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
