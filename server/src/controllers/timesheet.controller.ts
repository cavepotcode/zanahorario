import { JsonController, Get, Post, Param, Body, Authorize } from 'kiwi-server';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { TimesheetManager } from '../data_access/timesheetManager';
import { AddTimesheetDataIn } from '../sdk/data_in/addTimeSheetDataIn';

@Authorize()
@JsonController('/timesheet')
export class TimesheetController {
  constructor(private manager: TimesheetManager) {}

  @Get('/getProjectTimesheetHours/:month/:year')
  public getCurrentUser(@Param('month') month: number, @Param('year') year: number) {
    try {
      return this.manager.getProjectTimesheetHours(month, year);
    } catch (err) {
      Log.logError('timesheet/getProjectTimesheetHours', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Get('/getByUser/:month/:year')
  public getByUser(@Param('month') month: number, @Param('year') year: number) {
    try {
      return this.manager.getByUser(month, year);
    } catch (err) {
      Log.logError('timesheet/getProjectTimesheetHours', err);
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
