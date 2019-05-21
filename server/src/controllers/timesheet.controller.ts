import { JsonController, Get, Post, Param, Body, Authorize } from 'kiwi-server';
import { ResponseOut } from '../sdk/response';
import { Enums } from '../sdk/enums';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { TimesheetManager } from '../data_access/timesheetManager';
import { AddTimesheetDataIn } from '../sdk/data_in/addTimeSheetDataIn';

@Authorize()
@JsonController('/timesheet')
export class TimesheetController {
    constructor(private manager: TimesheetManager){}

    @Get('/getProjectTimesheetHours/:month/:year')
    public GetCurrentUser(@Param('month') month: number, @Param('year') year: number) {
        try {
            return this.manager.GetProjectTimesheetHours(month, year);
        }
        catch (err) {
            Log.LogError('timesheet/getProjectTimesheetHours', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Get('/getByUser/:month/:year')
    public GetByUser(@Param('month') month: number, @Param('year') year: number) {
        try {
            return this.manager.GetByUser(month, year);
        }
        catch (err) {
            Log.LogError('timesheet/getProjectTimesheetHours', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Post('/add')
    public Add(@Body() body: AddTimesheetDataIn) {
        try {
            return this.manager.Add(body);
        }
        catch (err) {
            Log.LogError('timesheet/add', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }
}