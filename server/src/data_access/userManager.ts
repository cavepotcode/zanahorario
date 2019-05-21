import { SqlManager, SqlParameter } from "./sql_manager/sqlManager";
import { LoginDataIn } from "../sdk/data_in/login_data_in";
import { LoginDataOut } from "../sdk/data_out/loginDataOut";
import { ResponseOut } from "../sdk/response";
import { Enums } from "../sdk/enums";
import { UtilClass } from "../util_class";
import { UserDataInfo } from "../sdk/data_info/user/userDataInfo";
import { environment } from "../../environment/environment";
import { SHAEncriptor } from "../encrypt";
import { StatusConstants } from "../sdk/constatnts";
const path = require("path");
const mssql = require('mssql');
const uuidv1 = require('uuid/v1');

export class UserManager {
    async Login(data: LoginDataIn) {
        var manager = new SqlManager(environment.db);
        var sql = 'SELECT 1 FROM Users WHERE Email=@Email And Password=@Password AND State=@State';
        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Email', mssql.VarChar(50), data.email));

        var sha = new SHAEncriptor();
        let pasword = sha.Encrypt(data.password);
        params.push(new SqlParameter('Password', mssql.VarChar(150), pasword));
        params.push(new SqlParameter('State', mssql.VarChar(20), StatusConstants.ACTIVE));

        let result = await manager.executeQuery(sql, params);
        if (result.length === 0) {
            return new ResponseOut(1, 'Username or password is invalid. Please try again');
        }

        sql = 'UPDATE Users set Token = @Token, TokenTimeStamp=@TokenTimeStamp where Email=@Email';
        params = Array<SqlParameter>();
        params.push(new SqlParameter('Email', mssql.VarChar(50), data.email));
        let token = uuidv1();
        params.push(new SqlParameter('Token', mssql.VarChar(36), token));
        params.push(new SqlParameter('TokenTimeStamp', mssql.DateTime, new Date()));

        await manager.executeNonQuery(sql, params);

        var login = new LoginDataOut();
        login.email = data.email;
        login.token = token;

        return new ResponseOut(Enums.responseCode.Ok, '', login);
    }

    async GetCurrentUser() {
        var manager = new SqlManager(environment.db);
        let pathImage = environment.common.pathImage;
        let str = "SELECT * FROM Users WHERE Id = @Id";
        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Id', mssql.VarChar(50), UtilClass.user_id));

        let result = await manager.executeQuery(str, params);
        var userInfo = new UserDataInfo();

        if (result.length > 0) {
            userInfo.id = result[0].Id;
            userInfo.color = result[0].Color;
            userInfo.email = result[0].Email;
            userInfo.initials = result[0].Initials;
            userInfo.name = result[0].Name;
            if (!result[0].ImageUrl) {
                userInfo.imageUrl = path.resolve("./") + '\\' + pathImage;
            }
            else {
                path.resolve("./") + '\\' + result[0].ImageUrl;
            }
        } else {
            return new ResponseOut(Enums.responseCode.Error, 'Unable to obtain information requested from the user.', null);
        }

        return new ResponseOut(Enums.responseCode.Ok, '', userInfo);
    }

    async GetUser() {
        var manager = new SqlManager(environment.db);
        let pathImage = environment.common.pathImage;
        let defaultImange = environment.common.defaultImage;

        let str = 'SELECT * FROM Users WHERE Id = @Id';
        var params = Array<SqlParameter>();
        params.push(new SqlParameter('Id', mssql.VarChar(50), UtilClass.user_id));

        let result = await manager.executeQuery(str, params);
        var userInfo = new UserDataInfo();

        if (result.length > 0) {
            userInfo.id = result[0].Id;
            userInfo.color = result[0].Color;
            userInfo.email = result[0].Email;
            userInfo.initials = result[0].Initials;
            userInfo.name = result[0].Name;
            if (!result[0].ImageUrl) {
                userInfo.imageUrl = path.resolve("./") + '\\' + pathImage + '\\' + defaultImange;
            }
            else {
                path.resolve("./") + '\\' + result[0].ImageUrl;
            }
        } else {
            return new ResponseOut(Enums.responseCode.Error, 'Unable to obtain information requested from the user.', null);
        }

        return new ResponseOut(Enums.responseCode.Ok, '', userInfo);
    }

    async UpdateUser(data: UserDataInfo) {
        // let strBuilder: string[] = [];
        var params = Array<SqlParameter>();

        // strBuilder.push("UPDATE Users SET Initials=@Initials, Color=@Color, Name=@Name ");
        let str = 'UPDATE Users SET Initials=@Initials, Color=@Color, Name=@Name WHERE Id=@Id';
        // VERIFICAR IMAGEN??
        // strBuilder.push("WHERE Id=@Id");

        params.push(new SqlParameter('Id', mssql.VarChar(50), UtilClass.user_id));
        params.push(new SqlParameter('Initials', mssql.VarChar(10), data.initials));
        params.push(new SqlParameter('Color', mssql.VarChar(20), data.color));
        params.push(new SqlParameter('Name', mssql.VarChar(20), data.name));

        var manager = new SqlManager(environment.db);
        // let str = strBuilder.join("");

        await manager.executeNonQuery(str, params);
        return new ResponseOut(Enums.responseCode.Ok, 'User updated successfully.', {});
    }

}