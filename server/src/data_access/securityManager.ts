import { SqlManager, SqlParameter } from './sql_manager/sqlManager';
import { environment } from '../../environment/environment';
import { UtilClass } from '../utilClass';

const mssql = require('mssql');

export class SecurityManager {
  async validateAction(token: string) {
    const manager = new SqlManager(environment.db);
    let sql = 'SELECT TokenTimeStamp, Email, Id FROM Users WHERE Token=@Token';
    let params = Array<SqlParameter>();
    params.push(new SqlParameter('Token', mssql.VarChar(36), token));

    const result = await manager.executeQuery(sql, params);

    if (result.lenght <= 0) {
      return false;
    }

    let tokenTimeStamp;
    let id;
    let email;

    result.forEach((element: any) => {
      id = element.Id;
      email = element.Email;
      tokenTimeStamp = element.TokenTimeStamp;
    });

    UtilClass.setLoggedUser(id, email);

    if (Date.parse(tokenTimeStamp) === NaN) {
      return false;
    }
    {
      let timeStamp = new Date(tokenTimeStamp);
      timeStamp = new Date(timeStamp.getTime() + environment.common.tokenTimeStamp * 60000);
      if (new Date().getTime() > timeStamp.getTime()) {
        return false;
      }
    }

    // UPDATE
    sql = 'UPDATE Users set TokenTimeStamp=@TokenTimeStamp where Token=@Token';
    params = Array<SqlParameter>();
    params.push(new SqlParameter('Token', mssql.VarChar(36), token));
    params.push(new SqlParameter('TokenTimeStamp', mssql.DateTime, new Date()));

    await manager.executeNonQuery(sql, params);
    return true;
  }
}
