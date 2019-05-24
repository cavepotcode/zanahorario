import { environment } from '../../environment/environment';
import { SqlManager, SqlParameter } from './sql_manager/sqlManager';
import { ResponseOut } from '../sdk/response';
import { Enums } from '../sdk/enums';
import { BillDataInfo } from '../sdk/data_info/bill/billDataInfo';
import { StatusConstants } from '../sdk/constatnts';
const mssql = require('mssql');
const uuidv1 = require('uuid/v1');

export class BillManager {
  async getAll(month: number, year: number) {
    const str =
      'SELECT * FROM Bills WHERE DATEPART(YYYY, Date) = @Year and DATEPART(mm, Date) = @Month ' +
      'AND State = @State  ORDER BY [date] desc';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Year', mssql.Int, year));
    params.push(new SqlParameter('Month', mssql.Int, month));
    params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.ACTIVE));

    const manager = new SqlManager(environment.db);
    const res = await manager.executeQuery(str, params);

    const ret = <BillDataInfo[]>[];
    res.forEach((element: any) => {
      const aux = new BillDataInfo();
      aux.id = element.Id;
      aux.date = element.Date;
      aux.client = element.Client;
      aux.currency = element.Currency;
      aux.nro = element.Nro;
      aux.paid = element.Paid;
      aux.subtotal = element.Subtotal;
      aux.taxes = element.Taxes;
      aux.total = element.Total;
      aux.type = element.Type;

      ret.push(aux);
    });

    return new ResponseOut(Enums.responseCode.Ok, '', ret);
  }

  async create(bill: BillDataInfo) {
    const sql =
      'INSERT INTO Bills (Id, Date, Nro, Client, Currency, Subtotal, Taxes, Total,Paid, Type) VALUES ' +
      '(@Id, @Date,@Nro, @Client, @Currency, @Subtotal, @Taxes, @Total, @Paid, @Type)';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(36), uuidv1()));

    params.push(new SqlParameter('Date', mssql.Date, bill.date));
    params.push(new SqlParameter('Nro', mssql.VarChar(36), bill.nro));
    params.push(new SqlParameter('Client', mssql.VarChar(50), bill.client));
    params.push(new SqlParameter('Currency', mssql.VarChar(50), bill.currency));
    params.push(new SqlParameter('Subtotal', mssql.Decimal(18, 2), bill.subtotal));
    params.push(new SqlParameter('Taxes', mssql.Decimal(18, 2), bill.taxes));
    params.push(new SqlParameter('Total', mssql.Decimal(18, 2), bill.total));
    params.push(new SqlParameter('Paid', mssql.Int, bill.paid));
    params.push(new SqlParameter('Type', mssql.VarChar(5), bill.type));

    const manager = new SqlManager(environment.db);
    await manager.executeNonQuery(sql, params);
    return new ResponseOut(Enums.responseCode.Ok, 'Bill added successfully', {});
  }

  async update(bill: BillDataInfo) {
    const sql =
      'UPDATE Bills SET Date = @Date , Nro =  @Nro, Client = @Client, Currency = @Currency, Subtotal = @Subtotal, ' +
      'Taxes = @Taxes, Total = @Total, Paid = @Paid WHERE Id = @Id';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(36), bill.id));

    params.push(new SqlParameter('Date', mssql.Date, bill.date));
    params.push(new SqlParameter('Nro', mssql.VarChar(36), bill.nro));
    params.push(new SqlParameter('Client', mssql.VarChar(50), bill.client));
    params.push(new SqlParameter('Currency', mssql.VarChar(50), bill.currency));
    params.push(new SqlParameter('Subtotal', mssql.Decimal(18, 2), bill.subtotal));
    params.push(new SqlParameter('Taxes', mssql.Decimal(18, 2), bill.taxes));
    params.push(new SqlParameter('Total', mssql.Decimal(18, 2), bill.total));
    params.push(new SqlParameter('Paid', mssql.Int, bill.paid));
    params.push(new SqlParameter('Type', mssql.VarChar(5), bill.type));

    const manager = new SqlManager(environment.db);
    await manager.executeNonQuery(sql, params);
    return new ResponseOut(Enums.responseCode.Ok, 'Bill updated successfully', {});
  }

  async delete(id: string) {
    const sql = 'UPDATE Bills SET State = @State WHERE Id = @Id';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(36), id));
    params.push(new SqlParameter('State', mssql.VarChar(50), StatusConstants.DELETED));

    const manager = new SqlManager(environment.db);
    await manager.executeNonQuery(sql, params);
    return new ResponseOut(Enums.responseCode.Ok, 'Bill deleted successfully', {});
  }
}
