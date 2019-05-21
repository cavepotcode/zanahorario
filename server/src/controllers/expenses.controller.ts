import { JsonController, Authorize, Get, Param, Put, Body } from "kiwi-server";
import { ResponseOut } from "../sdk/response";
import { Enums } from "../sdk/enums";
import { environment } from "../../environment/environment";
import { Log } from "../sdk/logs";
import { ExpesnesManager } from "../data_access/expensesManager";
import { ExpenditureDataInfo } from "../sdk/data_info/expenditure/expenditureDataInfo";

@Authorize()
@JsonController('/expenses')
export class ExpensesController { 
    constructor(private manager: ExpesnesManager){}

    @Get('/getAll/:month/:year')
    public GetAll(@Param('month') month: number, @Param('year') year: number) {
        try {
            return this.manager.getAll(year, month);
        }
        catch (err) {
            Log.LogError('category/getAll', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Put('/create')
    public Create(@Body() body: ExpenditureDataInfo) {
        try {
            return this.manager.Create(body);
        }
        catch (err) {
            Log.LogError('expenses/create', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }
}