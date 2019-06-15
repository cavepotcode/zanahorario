import { JsonController, Authorize, Get, Param, Put, Body } from 'kiwi-server';
import { Response } from '../sdk/response';
import { Enums } from '../sdk/enums';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { ExpensesManager } from '../data_access/expensesManager';
import { ExpenditureDataInfo } from '../sdk/data_info/expenditure/expenditureDataInfo';

@Authorize()
@JsonController('/expenses')
export class ExpensesController {
  constructor(private manager: ExpensesManager) {}

  @Get('/getAll/:month/:year')
  public getAll(@Param('month') month: number, @Param('year') year: number) {
    try {
      return this.manager.getAll(year, month);
    } catch (err) {
      Log.logError('category/getAll', err);
      return new Response(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }

  @Put('/create')
  public create(@Body() body: ExpenditureDataInfo) {
    try {
      return this.manager.create(body);
    } catch (err) {
      Log.logError('expenses/create', err);
      return new Response(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }
}
