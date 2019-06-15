import { JsonController, Get, Post, Param, Body, Authorize, Put, Delete } from 'kiwi-server';
import { BillManager } from '../data_access/billManager';
import { BillDataInfo } from '../sdk/data_info/bill/billDataInfo';
import { Log } from '../sdk/logs';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';

@Authorize()
@JsonController('/bill')
export class BillController {
  constructor(private manager: BillManager) {}

  @Get('/getAll/:month/:year')
  public get(@Param('month') month: number, @Param('year') year: number) {
    return this.manager.getAll(month, year);
  }

  @Put('/create')
  public create(@Body() body: BillDataInfo) {
    try {
      return this.manager.create(body);
    } catch (err) {
      Log.logError('bill/create', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Post('/update')
  public update(@Body() body: BillDataInfo) {
    try {
      return this.manager.update(body);
    } catch (err) {
      Log.logError('bill/update', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Delete('/delete/:id')
  public delete(@Param('id') id: string) {
    try {
      return this.manager.delete(id);
    } catch (err) {
      Log.logError('bill/delete', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
