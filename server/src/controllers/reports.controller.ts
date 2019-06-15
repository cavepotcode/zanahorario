import { JsonController, Get, Post, Param, Body, Authorize } from 'kiwi-server';
import { Log } from '../sdk/logs';
import { Response } from '../sdk/response';
import { environment } from '../../environment/environment';
import { ResponseCode } from '../sdk/constants';
import { ReportManager } from '../data_access/reportManager';

@Authorize()
@JsonController('/reports')
export class ReportsController {
  constructor(private manager: ReportManager) {}

  @Get('/getProjectsHoursByYear/:year')
  public getProjectsAndYear(@Param('year') year: number) {
    try {
      return this.manager.getProjectsHoursByYear(year);
    } catch (err) {
      Log.logError('reports/getProjectsHoursByYear', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Get('/getHoursByUser/:month/:year')
  public getHoursByUser(@Param('month') month: number, @Param('year') year: number) {
    try {
      return this.manager.getHoursByUser(year, month);
    } catch (err) {
      Log.logError('reports/getHoursByUser', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
