import { SqlParameter, SqlManager } from "./sql_manager/sqlManager";
import { environment } from "../../environment/environment";
import { ExpenditureDataInfo } from "../sdk/data_info/expenditure/expenditureDataInfo";
import { ResponseOut } from "../sdk/response";
import { Enums } from "../sdk/enums";
import { UtilClass } from "../util_class";
const mssql = require('mssql');
const uuidv1 = require('uuid/v1');

export class ExpesnesManager {
    async getAll(year: number, month: number) {
        let str = 'SELECT * FROM Expenses WHERE DATEPART(YYYY, Date) = @Year and DATEPART(mm, Date) = @Month ORDER BY Date Desc';
        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Year', mssql.Int, year));
        params.push(new SqlParameter('Month', mssql.Int, month));

        var manager = new SqlManager(environment.db);
        let res = await manager.executeQuery(str, params);

        let ret = new Array<ExpenditureDataInfo>();
        res.forEach(function (element: any) {
            let aux = new ExpenditureDataInfo();
            aux.amount = element.Amount;
            aux.bill = ((UtilClass.IsNullOrWithSpaces(element.Bill) ? '' : element.Bill));
            aux.category = element.Category;
            aux.client = element.Client;
            aux.currency = element.Currency
            aux.date = element.Date;
            aux.details = element.Details;
            aux.id = element.Id;
            aux.paid = element.Paid;
            aux.type = ((UtilClass.IsNullOrWithSpaces(element.Type) ? '' : element.Type));

            ret.push(aux);
        });

        return new ResponseOut(Enums.responseCode.Ok, '', ret);
    }

    async Create(data: ExpenditureDataInfo) {
        let sql = "INSERT INTO Expenses (Id, Date, Client, Details, Currency, Amount, Paid, Type, Category, Bill) VALUES (@Id, @Date, @Client, @Details, @Currency, @Amount, @Paid, @Type, @Category, @Bill)";
        var params = Array<SqlParameter>();
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

        var manager = new SqlManager(environment.db);
        await manager.executeNonQuery(sql, params);
        return new ResponseOut(Enums.responseCode.Ok, 'Expenditure added successfully', {});
        // if ((UtilClass.IsNullOrWithSpaces(data.bill))) {

        // }
    }

}