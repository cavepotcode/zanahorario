import { JsonController, Authorize, Get, Param, Put, Body, QueryParam } from 'kiwi-server';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { IDateFilter } from '../dto/date-filter.interface';
import { AuthService } from '../services/auth.service';
import { ExpenseService } from '../services/expense.service';

// @Authorize()
@JsonController('/expense')
export class ExpensesController {
  constructor(private expSvc: ExpenseService, private authSvc: AuthService) {}

  @Get('/all')
  public async getExpenses(@QueryParam() params: IDateFilter) {
    try {
      const { year, month } = params;
      const result = await this.expSvc.expense(year, month);
      return new Response(ResponseCode.OK, '', result);
    } catch (err) {
      Log.logError('ExpensesController.getExpenses', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
