import { JsonController, Get, Post, Param, Body, Authorize} from 'kiwi-server';
import { Log } from '../sdk/logs';
import { ResponseOut } from '../sdk/response';
import { environment } from '../../environment/environment';
import { Enums } from '../sdk/enums';
import { ReportManager } from '../data_access/reportManager';

@Authorize()
@JsonController('/reports')
export class ReportsController {
    constructor(private manager: ReportManager){}

    @Get('/getProjectsHoursByYear/:year')
    public GetProjectsAndYear(@Param('year') year: number) {
        try {
            return this.manager.GetProjectsHoursByYear(year);
        }
        catch (err) {
            Log.LogError('reports/getProjectsHoursByYear', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Get('/getHoursByUser/:month/:year')
    public GetHoursByUser(@Param('month') month: number, @Param('year') year: number) {
        try {
            return this.manager.GetHoursByUser(year, month);
        }
        catch (err) {
            Log.LogError('reports/getHoursByUser', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    } 
}
