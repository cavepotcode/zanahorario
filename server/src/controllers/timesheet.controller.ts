import { Authorize, Body, Get, JsonController, Param, Post, QueryParam } from 'kiwi-server';
import { IncomingMessage } from 'http';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { TimesheetService } from '../services/timesheet.service';
import { AuthService } from '../services/auth.service';
import { IDateFilter } from '../dto/date-filter.interface';
import { TimesheetEntry } from '../dto/timesheet-entry';

@Authorize()
@JsonController('/timesheet')
export class TimesheetController {
  constructor(private timeSvc: TimesheetService, private authSvc: AuthService) {}

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

  @Get('/user')
  public async getUserTimesheets(@QueryParam() params: IDateFilter, req: IncomingMessage) {
    try {
      const { year, month, day } = params;
      const from = new Date(year, month - 1, day);
      const result = await this.timeSvc.userWeekHours(req.user.id, from);
      return new Response(ResponseCode.OK, '', result);
    } catch (err) {
      Log.logError('TimesheetController.getProjectsTimesheets', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Post('/')
  public async add(@Body() entries: TimesheetEntry[], req: IncomingMessage) {
    try {
      const result = await this.timeSvc.add(req.user.id, entries);
      return new Response(ResponseCode.OK, '');
    } catch (err) {
      Log.logError('timesheet/add', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
