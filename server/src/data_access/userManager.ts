import { SqlManager, SqlParameter } from './sql_manager/sqlManager';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { Response } from '../sdk/response';
import { UtilClass } from '../utilClass';
import { UserDataInfo } from '../sdk/data_info/user/userDataInfo';
import { environment } from '../../environment/environment';
import { encrypt } from '../encrypt';
import { ResponseCode, StatusConstants } from '../sdk/constants';
const path = require('path');
const mssql = require('mssql');
const uuidv1 = require('uuid/v1');
const jwt = require('jsonwebtoken');

export class UserManager {
  async getCurrentUser() {
    const manager = new SqlManager(environment.db);
    const pathImage = environment.common.pathImage;
    const str = 'SELECT * FROM Users WHERE Id = @Id';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(50), UtilClass.userId));

    const result = await manager.executeQuery(str, params);
    const userInfo = new UserDataInfo();

    if (result.length > 0) {
      userInfo.id = result[0].Id;
      userInfo.color = result[0].Color;
      userInfo.email = result[0].Email;
      userInfo.initials = result[0].Initials;
      userInfo.name = result[0].Name;
      if (!result[0].ImageUrl) {
        userInfo.imageUrl = path.resolve('./', pathImage);
      } else {
        path.resolve('./', result[0].ImageUrl);
      }
    } else {
      return new Response(ResponseCode.ERROR, 'Unable to obtain information requested from the user.', null);
    }

    return new Response(ResponseCode.OK, '', userInfo);
  }

  async getUser() {
    const manager = new SqlManager(environment.db);
    const pathImage = environment.common.pathImage;
    const defaultImage = environment.common.defaultImage;

    const str = 'SELECT * FROM Users WHERE Id = @Id';
    const params = Array<SqlParameter>();
    params.push(new SqlParameter('Id', mssql.VarChar(50), UtilClass.userId));

    const result = await manager.executeQuery(str, params);
    const userInfo = new UserDataInfo();

    if (result.length > 0) {
      userInfo.id = result[0].Id;
      userInfo.color = result[0].Color;
      userInfo.email = result[0].Email;
      userInfo.initials = result[0].Initials;
      userInfo.name = result[0].Name;
      if (!result[0].ImageUrl) {
        userInfo.imageUrl = path.resolve('./', pathImage, defaultImage);
      } else {
        path.resolve('./', result[0].ImageUrl);
      }
    } else {
      return new Response(ResponseCode.ERROR, 'Unable to obtain information requested from the user.', null);
    }

    return new Response(ResponseCode.OK, '', userInfo);
  }

  async updateUser(data: UserDataInfo) {
    // let strBuilder: string[] = [];
    const params = Array<SqlParameter>();

    // strBuilder.push("UPDATE Users SET Initials=@Initials, Color=@Color, Name=@Name ");
    const str = 'UPDATE Users SET Initials=@Initials, Color=@Color, Name=@Name WHERE Id=@Id';
    // VERIFICAR IMAGEN??
    // strBuilder.push("WHERE Id=@Id");

    params.push(new SqlParameter('Id', mssql.VarChar(50), UtilClass.userId));
    params.push(new SqlParameter('Initials', mssql.VarChar(10), data.initials));
    params.push(new SqlParameter('Color', mssql.VarChar(20), data.color));
    params.push(new SqlParameter('Name', mssql.VarChar(20), data.name));

    const manager = new SqlManager(environment.db);
    // let str = strBuilder.join("");

    await manager.executeNonQuery(str, params);
    return new Response(ResponseCode.OK, 'User updated successfully.', {});
  }
}
