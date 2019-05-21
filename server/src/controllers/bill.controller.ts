import { JsonController, Get, Post, Param, Body, Authorize, Put, Delete} from 'kiwi-server';
import { BillManager } from '../data_access/billManager';
import { BillDataInfo } from '../sdk/data_info/bill/billDataInfo';
import { Log } from '../sdk/logs';
import { ResponseOut } from '../sdk/response';
import { Enums } from '../sdk/enums';
import { environment } from '../../environment/environment';

@Authorize()
@JsonController('/bill')
export class BillController {
    constructor(private manager: BillManager){}

    @Get('/getAll/:month/:year')
    public get(@Param('month') month: number, @Param('year') year: number) {
        return this.manager.getAll(month, year);
    }

    @Put('/create')
    public Create(@Body() body: BillDataInfo) {
        try {
            return this.manager.Create(body);
        }
        catch (err) {
            Log.LogError('bill/create', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Post('/update')
    public Update(@Body() body: BillDataInfo) {
        try {
            return this.manager.Update(body);
        }
        catch (err) {
            Log.LogError('bill/update', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Delete('/delete/:id')
    public Delete(@Param('id') id: string) {
        try {
            return this.manager.Delete(id);
        }
        catch (err) {
            Log.LogError('bill/delete', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }
}