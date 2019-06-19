import { SqlParameter, SqlManager } from './sql_manager/sqlManager';
import { environment } from '../../environment/environment';
import { ExpenditureDataInfo } from '../sdk/data_info/expenditure/expenditureDataInfo';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { UtilClass } from '../utilClass';
const mssql = require('mssql');
const uuidv1 = require('uuid/v1');

export class ExpensesManager {
  async getAll(year: number, month: number) {
    const str =
      'SELECT * FROM Expenses WHERE DATEPART(YYYY, Date) = @Year and DATEPART(mm, Date) = @Month ORDER BY Date Desc';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Year', mssql.Int, year));
    params.push(new SqlParameter('Month', mssql.Int, month));

    const manager = new SqlManager(environment.db);
    const res = await manager.executeQuery(str, params);

    const ret = <ExpenditureDataInfo[]>[];
    res.forEach((element: any) => {
      const aux = new ExpenditureDataInfo();
      aux.amount = element.Amount;
      aux.bill = UtilClass.isNullOrWithSpaces(element.Bill) ? '' : element.Bill;
      aux.category = element.Category;
      aux.client = element.Client;
      aux.currency = element.Currency;
      aux.date = element.Date;
      aux.details = element.Details;
      aux.id = element.Id;
      aux.paid = element.Paid;
      aux.type = UtilClass.isNullOrWithSpaces(element.Type) ? '' : element.Type;

      ret.push(aux);
    });

    return new Response(ResponseCode.OK, '', ret);
  }

  async create(data: ExpenditureDataInfo) {
    const sql =
      'INSERT INTO Expenses (Id, Date, Client, Details, Currency, Amount, Paid, Type, Category, Bill) VALUES ' +
      '(@Id, @Date, @Client, @Details, @Currency, @Amount, @Paid, @Type, @Category, @Bill)';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(36), uuidv1()));
    params.push(new SqlParameter('Date', mssql.Date, data.date));
    params.push(new SqlParameter('Client', mssql.VarChar(50), data.client));
    params.push(new SqlParameter('Details', mssql.VarChar(500), data.details));
    params.push(new SqlParameter('Currency', mssql.VarChar(50), data.currency));
    params.push(new SqlParameter('Amount', mssql.Int, data.amount));
    params.push(new SqlParameter('Paid', mssql.Int, data.paid));
    params.push(new SqlParameter('Type', mssql.VarChar(5), data.type));
    params.push(new SqlParameter('Category', mssql.Int, data.category));
    params.push(new SqlParameter('Bill', mssql.Int, data.bill));

    const manager = new SqlManager(environment.db);
    await manager.executeNonQuery(sql, params);
    return new Response(ResponseCode.OK, 'Expenditure added successfully', {});
    // if ((UtilClass.isNullOrWithSpaces(data.bill))) {

    // }
  }
}
