import { environment } from "../../environment/environment";
import { SqlManager } from "./sql_manager/sqlManager";
import { CategoryDataInfo } from "../sdk/data_info/category/categoryDataInfo";
import { ResponseOut } from "../sdk/response";
import { Enums } from "../sdk/enums";
const path = require("path");

export class CategoryManager {
    async getAll() {
        let pathImage = environment.common.pathImage;
        let str = 'SELECT * FROM Categories';
        var manager = new SqlManager(environment.db);
        let res = await manager.executeQuery(str);

        let ret = new Array<CategoryDataInfo>();
        res.forEach(function (element: any) {
            let aux = new CategoryDataInfo();
            aux.id = element.Id;
            aux.description = element.Description;
            aux.color = element.Color;

            if (!element.Icono) {
                aux.iconoName = path.resolve("./") + '\\' + pathImage;
            }
            else {
                aux.iconoName =  element.Icono;
            }

            ret.push(aux);
        });

        return new ResponseOut(Enums.responseCode.Ok, '', ret);
    }
}